from flask import Flask, jsonify, request, abort
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///trade_data.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class TradeData(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.String(10), nullable=False)
    trade_code = db.Column(db.String(20), nullable=False)
    high = db.Column(db.Float, nullable=False)
    low = db.Column(db.Float, nullable=False)
    open = db.Column(db.Float, nullable=False)
    close = db.Column(db.Float, nullable=False)
    volume = db.Column(db.Integer, nullable=False)

@app.route("/api/trade_data", methods=['GET'])
def get_trade_data():
    trade_code = request.args.get('trade_code')
    if trade_code:
        trade_data = TradeData.query.filter_by(trade_code=trade_code).all()
    else:
        trade_data = TradeData.query.all()
    return jsonify([{
        'id': item.id,
        'date': item.date,
        'trade_code': item.trade_code,
        'high': item.high,
        'low': item.low,
        'open': item.open,
        'close': item.close,
        'volume': item.volume
    } for item in trade_data])

@app.route("/api/trade_data/<int:id>", methods=['PUT'])
def update_trade_data(id):
    data = request.json
    trade_data = TradeData.query.get(id)
    if not trade_data:
        return abort(404, description="Resource not found")

    trade_data.date = data.get('date', trade_data.date)
    trade_data.trade_code = data.get('trade_code', trade_data.trade_code)
    trade_data.high = data.get('high', trade_data.high)
    trade_data.low = data.get('low', trade_data.low)
    trade_data.open = data.get('open', trade_data.open)
    trade_data.close = data.get('close', trade_data.close)
    trade_data.volume = data.get('volume', trade_data.volume)

    db.session.commit()
    return jsonify({'message': 'Trade data updated successfully'})

@app.route("/api/trade_data/<int:id>", methods=['DELETE'])
def delete_trade_data(id):
    trade_data = TradeData.query.get(id)
    if not trade_data:
        return abort(404, description="Resource not found")

    db.session.delete(trade_data)
    db.session.commit()
    return jsonify({'message': 'Trade data deleted successfully'})

@app.route("/api/trade_data", methods=['POST'])
def add_trade_data():
    data = request.json
    if not all(key in data for key in ('date', 'trade_code', 'high', 'low', 'open', 'close', 'volume')):
        return abort(400, description="Incomplete data")

    new_trade_data = TradeData(
        date=data['date'],
        trade_code=data['trade_code'],
        high=data['high'],
        low=data['low'],
        open=data['open'],
        close=data['close'],
        volume=data['volume']
    )

    db.session.add(new_trade_data)
    db.session.commit()
    return jsonify({'message': 'Trade data added successfully'}), 201

if __name__ == '__main__':
    app.run(debug=True)
