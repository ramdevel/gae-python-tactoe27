import webapp2
from google.appengine.api import users
from google.appengine.api import memcache
from google.appengine.api import channel



CHANNEL_NAME = 'discovery'

class Observable():
    def __init__(self, room):
        self._room = room
        self._observers = memcache.get(self._room)

    def add_observer(self, user):
        if self._observers is not None:
            self._observers.update(user)
        else:
            self._observers = user

        memcache.set(self._room, self._observers, 30*60)
            
    def delete_observer(self, user):
        del self._observers[user]
        
    def notify_observers(self, data):
        for channel_id in self._observers.values():
            channel.send_message(channel_id, data)

class Observer(webapp2.RequestHandler):

    def update(self, arg):
        observable = Observable(CHANNEL_NAME)
        observable.notify_observers(arg)