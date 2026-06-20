import json
import os
import psycopg2
from datetime import datetime

SCHEMA = 't_p62889068_mobile_profit_app_la'
CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
}


def get_conn():
    dsn = os.environ['DATABASE_URL']
    if 'sslmode' not in dsn:
        dsn += ('&' if '?' in dsn else '?') + 'sslmode=disable'
    return psycopg2.connect(dsn)


def handler(event: dict, context) -> dict:
    """
    Wallet API: сохранение заявок на вывод и получение операций.
    GET /  — список операций и баланс пользователя
    POST / — создать заявку на вывод (amount, bank_name, card_mask)
    """
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    method = event.get('httpMethod', 'GET')
    qs = event.get('queryStringParameters') or {}
    user_id = qs.get('user_id', 'default') or 'default'

    conn = get_conn()
    cur = conn.cursor()

    if method == 'GET':
        cur.execute(
            "SELECT id, icon, title, sub, amount, up, day FROM " + SCHEMA + ".operations "
            "WHERE user_id = %s ORDER BY created_at DESC LIMIT 50",
            (user_id,)
        )
        rows = cur.fetchall()
        ops = [
            {'id': r[0], 'icon': r[1], 'title': r[2], 'sub': r[3], 'amount': r[4], 'up': r[5], 'day': r[6]}
            for r in rows
        ]
        cur.execute(
            "SELECT COALESCE(SUM(CASE WHEN up THEN amount ELSE -amount END), 0) FROM "
            + SCHEMA + ".operations WHERE user_id = %s",
            (user_id,)
        )
        balance = int(cur.fetchone()[0])
        conn.close()
        return {
            'statusCode': 200,
            'headers': {**CORS, 'Content-Type': 'application/json'},
            'body': json.dumps({'balance': balance, 'operations': ops}),
        }

    if method == 'POST':
        body = json.loads(event.get('body') or '{}')
        amount = int(body.get('amount', 0))
        bank_name = body.get('bank_name', 'Тинькофф Банк')
        card_mask = body.get('card_mask', '•••• 4417')

        if amount < 100:
            conn.close()
            return {
                'statusCode': 400,
                'headers': {**CORS, 'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'Минимальная сумма вывода — 100 ₽'}),
            }

        cur.execute(
            "SELECT COALESCE(SUM(CASE WHEN up THEN amount ELSE -amount END), 0) FROM "
            + SCHEMA + ".operations WHERE user_id = %s",
            (user_id,)
        )
        balance = int(cur.fetchone()[0])

        if amount > balance:
            conn.close()
            return {
                'statusCode': 400,
                'headers': {**CORS, 'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'Недостаточно средств'}),
            }

        time_str = datetime.now().strftime('%H:%M')
        cur.execute(
            "INSERT INTO " + SCHEMA + ".withdrawals (user_id, amount, bank_name, card_mask) "
            "VALUES (%s, %s, %s, %s)",
            (user_id, amount, bank_name, card_mask)
        )
        cur.execute(
            "INSERT INTO " + SCHEMA + ".operations (user_id, icon, title, sub, amount, up, day) "
            "VALUES (%s, %s, %s, %s, %s, %s, %s)",
            (user_id, 'ArrowDownToLine', 'Вывод · ' + bank_name, time_str, amount, False, 'Сегодня')
        )
        conn.commit()

        cur.execute(
            "SELECT COALESCE(SUM(CASE WHEN up THEN amount ELSE -amount END), 0) FROM "
            + SCHEMA + ".operations WHERE user_id = %s",
            (user_id,)
        )
        new_balance = int(cur.fetchone()[0])
        conn.close()

        return {
            'statusCode': 200,
            'headers': {**CORS, 'Content-Type': 'application/json'},
            'body': json.dumps({'success': True, 'balance': new_balance}),
        }

    conn.close()
    return {'statusCode': 405, 'headers': CORS, 'body': 'Method Not Allowed'}
