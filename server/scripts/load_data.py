import json
import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import app, db
from models import TradeData

def load_data_from_json(file_path):
    with open(file_path, mode='r') as file:
        data = json.load(file)
        for row in data:
            # Remove commas from numeric fields and convert them to appropriate types
            high = float(row['high'].replace(',', ''))
            low = float(row['low'].replace(',', ''))
            open_price = float(row['open'].replace(',', ''))
            close = float(row['close'].replace(',', ''))
            volume = int(row['volume'].replace(',', ''))

            trade_data = TradeData(
                date=row['date'],
                trade_code=row['trade_code'],
                high=high,
                low=low,
                open=open_price,
                close=close,
                volume=volume
            )
            db.session.add(trade_data)
        db.session.commit()

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
        load_data_from_json(os.path.join(os.path.dirname(__file__), 'stock_market_data.json'))
