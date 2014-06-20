#!/usr/bin/python
# -*- coding: utf-8 -*-
import web
from models import User
import util
import os
import sys

urls = (
    "/signin", "signin",
    "/", "index",
    "/signup","signup",
    "/logout", "logout"
)

app = web.application(urls, globals())

if web.config.get('_session') is None:
    session = web.session.Session(app, web.session.DiskStore('sessions'), {'login': 0, 'username': 0})
    web.config._session = session
else:
    session = web.config._session
    
#render = web.template.render('templates/', globals={'context': session})
curdir = os.path.abspath(os.path.dirname(__file__))
templates = curdir + '/templates/'
render_plain = web.template.render(templates, globals={'context': session})
render = web.template.render(templates, base='layout', globals={'context': session})
    
def logged():
    if 'login' not in session or session.login == 0:
        session.login = 0
        return False
    else:
        return True
    
class signin:
    def GET(self):
        if logged():
            return web.seeother('/')
        else:
            return render_plain.signin()
    def POST(self):
        name, passwd = web.input().username, web.input().password
        user_type = User().validate_user(name, passwd)
        if user_type != 0:
            session.login = 1
            session.username = name
            return web.seeother('/') 
        else:
            return render_plain.signin()

class signup:
    def GET(self):
        users = User().getAll()
        return render.signup("",users)
    
    def POST(self):
        try:
            name, passwd = web.input().name, web.input().password
            type = web.input(isadmin='false')
            if type.isadmin == 'true':
                user_type = 1
            else:
                user_type = 2
            User().add(name, passwd, user_type)
        except Exception, e:
            users = User().getAll()
            return render.signup("Error, please try again",users)
        else:
            raise web.seeother('/signup')
    

        
class index:
    def GET(self):
        if logged():
            return render.index()
        else:
            return web.seeother('/signin')

class logout:
    def GET(self):
        session.login = 0
        session.username = ''
        return render_plain.signin()

if __name__ == "__main__":
    app.run()
