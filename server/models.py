from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class TradeData(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.String, nullable=False)
    trade_code = db.Column(db.String, nullable=False)
    high = db.Column(db.Float, nullable=False)
    low = db.Column(db.Float, nullable=False)
    open = db.Column(db.Float, nullable=False)
    close = db.Column(db.Float, nullable=False)
    volume = db.Column(db.Integer, nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'date': self.date,
            'trade_code': self.trade_code,
            'high': self.high,
            'low': self.low,
            'open': self.open,
            'close': self.close,
            'volume': self.volume
        }
