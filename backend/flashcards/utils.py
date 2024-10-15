from collections import deque
from django.core.cache import cache

class StudySessionManager:
    """
    Manages the queue of cards for a study session.
    """
    def __init__(self, user_id):
        self.user_id = user_id
        self.queue_key = f"study_queue_{self.user_id}"

    def get_queue(self):
        return cache.get(self.queue_key, deque())

    def save_queue(self, queue):
        cache.set(self.queue_key, queue, timeout=3600)

    def add_card(self, card_id):
        queue = self.get_queue()
        queue.append(card_id)
        self.save_queue(queue)

    def get_next_card(self):
        queue = self.get_queue()
        if queue:
            card_id = queue.popleft()  # Retrieve and remove the first item.
            self.save_queue(queue)
            return card_id
        return None

    def reinsert_card(self, card_id):
        queue = self.get_queue()
        queue.append(card_id)
        self.save_queue(queue)

    def clear_queue(self):
        cache.delete(self.queue_key)
