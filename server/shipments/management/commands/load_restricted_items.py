from django.core.management.base import BaseCommand
from shipments.models import RestrictedItem

class Command(BaseCommand):
    help = 'Load restricted items data'

    def handle(self, *args, **options):
        restricted_items = [
            {'name': 'Firearms', 'category': 'Weapons', 'description': 'All types of firearms and ammunition'},
            {'name': 'Explosives', 'category': 'Hazardous', 'description': 'Explosive materials and devices'},
            {'name': 'Liquids over 100ml', 'category': 'Liquids', 'description': 'Liquids exceeding airline limits'},
            {'name': 'Lithium batteries', 'category': 'Electronics', 'description': 'Loose lithium batteries'},
            {'name': 'Flammable items', 'category': 'Hazardous', 'description': 'Flammable liquids and solids'},
            {'name': 'Sharp objects', 'category': 'Weapons', 'description': 'Knives, scissors, and sharp tools'},
            {'name': 'Drugs', 'category': 'Illegal', 'description': 'Illegal drugs and substances'},
            {'name': 'Perishable food', 'category': 'Food', 'description': 'Food items that can spoil'},
        ]

        for item_data in restricted_items:
            RestrictedItem.objects.get_or_create(
                name=item_data['name'],
                defaults=item_data
            )

        self.stdout.write(
            self.style.SUCCESS('Successfully loaded restricted items')
        )