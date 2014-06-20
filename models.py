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
        db.users.insert([{"_id":DataBase().getNextSequence("userid"),"name":name, "pwd":pwdhash, "type":user_type}])
    
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
        if user == None:
            return 0
        else:
            return user['type']


class Shop:
        
    def addShop(self, name, info, owner):
        db.shops.insert({"name": name, "owner":owner, "status":"Ready"})
        
    def getShop(self, name):
        shop = db.shops.find_one({"name":name})
        return shop
    
        