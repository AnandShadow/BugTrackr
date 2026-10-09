from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import declarative_base, sessionmaker

# 1. The Connection String
DATABASE_URL = "mysql+pymysql://root:root@localhost:3306/bugtrackr"

# 2. The Engine (The physical connection cable)
engine = create_engine(DATABASE_URL)

# 3. The Master Binder
Base = declarative_base()

# 4. Your Ticket Blueprint
class Ticket(Base):
    __tablename__ = "tickets"
    id = Column(Integer, primary_key=True)
    title = Column(String(100))
    description = Column(String(255))
    status = Column(String(50), default="To-Do")

# 5. The Magic Command: Build the tables!
Base.metadata.create_all(bind=engine)
print("Tables created successfully!")
SessionLocal= sessionmaker(bind= engine)