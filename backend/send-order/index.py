import json
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


def handler(event: dict, context) -> dict:
    """Отправляет заявку на расчёт грузоперевозки на почту yulmitrans@mail.ru"""

    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }

    body = json.loads(event.get('body') or '{}')
    from_city = body.get('from', '')
    to_city = body.get('to', '')
    weight = body.get('weight', '')
    name = body.get('name', '')
    phone = body.get('phone', '')

    smtp_password = os.environ.get('SMTP_PASSWORD', '')

    msg = MIMEMultipart('alternative')
    msg['Subject'] = f'Новая заявка на расчёт — {name}'
    msg['From'] = 'yulmitrans@mail.ru'
    msg['To'] = 'yulmitrans@mail.ru'

    html = f"""
    <html><body style="font-family: Arial, sans-serif; background: #f5f5f5; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
      <div style="background: #ff6b00; padding: 24px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 22px;">ЮЛМИ-ТРАНС — Новая заявка</h1>
      </div>
      <div style="padding: 32px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 10px 0; color: #888; width: 140px;">Откуда:</td><td style="padding: 10px 0; font-weight: bold; color: #333;">{from_city}</td></tr>
          <tr style="background: #fafafa;"><td style="padding: 10px; color: #888;">Куда:</td><td style="padding: 10px; font-weight: bold; color: #333;">{to_city}</td></tr>
          <tr><td style="padding: 10px 0; color: #888;">Вес груза:</td><td style="padding: 10px 0; font-weight: bold; color: #333;">{weight} кг</td></tr>
          <tr style="background: #fafafa;"><td style="padding: 10px; color: #888;">Имя клиента:</td><td style="padding: 10px; font-weight: bold; color: #333;">{name}</td></tr>
          <tr><td style="padding: 10px 0; color: #888;">Телефон:</td><td style="padding: 10px 0; font-weight: bold; color: #ff6b00; font-size: 18px;">{phone}</td></tr>
        </table>
        <div style="margin-top: 24px; padding: 16px; background: #fff3e0; border-left: 4px solid #ff6b00; border-radius: 4px;">
          <p style="margin: 0; color: #666;">Свяжитесь с клиентом в течение 15 минут!</p>
        </div>
      </div>
    </div>
    </body></html>
    """

    msg.attach(MIMEText(html, 'html', 'utf-8'))

    with smtplib.SMTP_SSL('smtp.mail.ru', 465) as server:
        server.login('yulmitrans@mail.ru', smtp_password)
        server.sendmail('yulmitrans@mail.ru', 'yulmitrans@mail.ru', msg.as_string())

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'success': True})
    }
