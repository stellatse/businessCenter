#!/usr/bin/python
# -*- coding: utf-8 -*-
'''
Created on Jun 10, 2014

@author: xixin
'''
import pymongo
from pymongo import MongoClient
import hashlib
from database import DataBase

db = DataBase().db


class User:
    def add(self, name, pwd, user_type):
        pwdhash = hashlib.md5(pwd).hexdigest()
        db.users.insert(
            [{"_id": DataBase().getNextSequence("userid"), "name": name, "pwd": pwdhash, "type": user_type}])

    def get(self, name):
        user = db.users.find_one({"name": name})
        return user

    def getAll(self):
        ret = []
        users = db.users.find()
        for user in users:
            ret.append(user)
        return ret

    def validate_user(self, name, password):
        pwdhash = hashlib.md5(password).hexdigest()
        user = db.users.find_one({"name": name, "pwd": pwdhash})
        print pwdhash
        if user is None:
            return 0
        else:
            return user['type']


class Shop:
    @staticmethod
    def add_shop(name, info, owner):
        db.shops.insert({"name": name, "owner": owner, "status": "Ready"})

    @staticmethod
    def get_shop(name):
        shop = db.shops.find_one({"name": name})
        return shop


class Item:
    def getAll(self):
        ret = []
        items = db.items.find()
        for item in items:
            ret.append(item)
        return ret


class Stock:
    def getAll(self):
        ret = []
        stocks = db.stocks.find()
        for stock in stocks:
            ret.append(stock)
        return ret

    def get_default(self, user_id):
        ret = db.stocks.find_one({'_id': 1})['name']
        return ret