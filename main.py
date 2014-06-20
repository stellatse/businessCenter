#!/usr/bin/python
# -*- coding: utf-8 -*-
import web
from models import User, Shop
import util
import os
import sys

urls = (
    "/signin", "signin",
    "/", "index",
    "/signup","signup",
    "/logout", "logout",
    "/shop", "shop"
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
        user = User().get(name)
        if user_type != 0:
            session.login = 1
            session.id = user['_id']
            if user_type == 1:
                session.admin = True
            else:
                session.admin = False
            return web.seeother('/') 
        else:
            return render_plain.signin("用户名不存在，或密码错误")

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
            if session.admin==True:
                return render.admin_index()
            else:
                return render.index()
        else:
            return web.seeother('/signin')

class logout:
    def GET(self):
        session.login = 0
        session.id = ''
        session.admin = False
        return render_plain.signin()


class shop:
    def GET(self):
        
        return render.shop()
    
    def POST(self):
        name, info = web.input().name, web.input().info
        Shop().addShop(name, info, session.id)

if __name__ == "__main__":
    app.run()
