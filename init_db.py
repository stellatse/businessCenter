#!/usr/bin/python
# -*- coding: utf-8 -*-
'''
Created on Jun 11, 2014

@author: xixin
'''
import pymongo
from pymongo import MongoClient
from database import DataBase

db = DataBase().db

print("remove all data")
db.user_type.remove()
db.users.remove()
db.items.remove()
db.counters.remove()

print("init user types")
db.user_type.insert([{"_id": 1, "name": "admin"},
                     {"_id": 2, "name": "user"}
])
db.counters.insert([
    {'_id': "userid", "seq": 0},
    {'_id': "stockid", "seq": 0}
])



# db.users.ensureIndex( { "name": 1 } )
print("init users, first 2 users, one is admin, another is sales, password is empty")
db.users.insert([
    {"_id": DataBase().getNextSequence("userid"), "name": "stella", "pwd": "d41d8cd98f00b204e9800998ecf8427e",
     "type": 1, "phone": "13810101011", "address": "上海虹口"},
    {"_id": DataBase().getNextSequence("userid"), "name": "sales", "pwd": "d41d8cd98f00b204e9800998ecf8427e", "type": 2,
     "phone": "13810101022", "address": "上海浦东"}
])

print("init items")
db.items.insert([
    {"number": "MM100001", "name": "面膜1", "quantity": "100", "cost": "10", "update_user": "stella", "update_time": "9/3/2014 03:09PM"},
    {"number": "MM100002", "name": "面膜22", "quantity": "101", "cost": "10", "update_user": "stella", "update_time": "9/3/2014 03:09PM"},
    {"number": "MM100003", "name": "洗面奶1", "quantity": "102", "cost": "10", "update_user": "stella", "update_time": "9/3/2014 03:09PM"},
    {"number": "MM100004", "name": "洗面奶2", "quantity": "45", "cost": "10", "update_user": "stella", "update_time": "9/3/2014 03:09PM"},
    {"number": "MM100005", "name": "面膜3", "quantity": "103", "cost": "10", "update_user": "stella", "update_time": "9/3/2014 03:09PM"},
    {"number": "MM100006", "name": "面膜4", "quantity": "104", "cost": "10", "update_user": "stella", "update_time": "9/3/2014 03:09PM"},
    {"number": "MM100007", "name": "面膜5", "quantity": "105", "cost": "10", "update_user": "stella", "update_time": "9/3/2014 03:09PM"},
    {"number": "MM100008", "name": "面膜6", "quantity": "107", "cost": "10", "update_user": "stella", "update_time": "9/3/2014 03:09PM"},
])

print("init stocks")
db.stocks.insert([
    {"_id": DataBase().getNextSequence("stockid"), "name": "上海仓库"},
    {"_id": DataBase().getNextSequence("stockid"), "name": "北京仓库"},
    {"_id": DataBase().getNextSequence("stockid"), "name": "广州仓库"},
])


