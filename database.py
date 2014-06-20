#!/usr/bin/python
# -*- coding: utf-8 -*-
'''
Created on Jun 19, 2014

@author: xixin
'''
import pymongo
from pymongo import MongoClient

class DataBase:
    '''
    Define all database level function
    '''
    def getNextSequence(self, name):
        ret = self.db.counters.find_and_modify(query={"_id":name},update={"$inc":{"seq":1}}, new=True)
        return ret['seq']

    def __init__(self):
        '''
        Constructor
        '''
        print("connecting db and get db")
        client = MongoClient('localhost', 27017)
        self.db = client.bz_db
        