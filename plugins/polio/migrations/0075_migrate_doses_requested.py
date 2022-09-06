import math
from django.db import migrations, models


def get_round_doses_requested(apps, schema_editor):
    # noinspection PyPep8Naming
    Campaign = apps.get_model("polio", "Campaign")
    Round = apps.get_model("polio", "Round")
    all_rounds = Round.objects.all()
    for c in Campaign.objects.all():
        if c.doses_requested:
            for round in all_rounds.filter(campaign=c):
                round.doses_requested = math.floor(c.doses_requested / len(c.rounds.all()))
                round.save()


class Migration(migrations.Migration):

    dependencies = [
        ("polio", "0074_round_doses_requested"),
    ]

    operations = [
        migrations.RunPython(get_round_doses_requested),
    ]
