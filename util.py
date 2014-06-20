'''
Created on Jun 11, 2014

@author: xixin
'''
#!/usr/bin/python
# -*- coding: utf-8 -*-
import web

def trim_utf8(text, length):
    extra_flag = '...' if length < len(text.decode('utf-8')) else ''
    return text.decode('utf-8')[0:length].encode('utf-8') + extra_flag

