from faker import Faker
import random

fake = Faker()

# -------------------------------
# CONFIG
# -------------------------------
NUM_USERS = 3000
NUM_EVENTS = 2000
NUM_ADMINS = 150
NUM_TICKETS = 5000
NUM_WISHLIST = 800
NUM_PAYMENTS = 900
NUM_DISCUSSION = 600
NUM_REPLY = 1500
NUM_REPORTS = 300
NUM_POSTAL = 50
BATCH_SIZE = 200

OUTPUT = "load_data.sql"

# -------------------------------
# HELPERS
# -------------------------------
def clean_phone():
    return ''.join(filter(str.isdigit, fake.phone_number()))[:10]


def write_bulk_insert(file, table, columns, rows):
    if not rows:
        return
    col_str = ", ".join(columns)
    file.write(f"INSERT INTO {table} ({col_str}) VALUES\n")
    for i, row in enumerate(rows):
        line = "(" + ", ".join(row) + ")"
        if i < len(rows) - 1:
            line += ","
        file.write(line + "\n")
    file.write(";\n\n")


# ---------------------------------
# MAIN GENERATOR
# ---------------------------------
with open(OUTPUT, "w", encoding="utf8") as f:

    f.write("USE EventEase;\n\n")

    # ---------------------------------
    # POSTAL AREAS
    # ---------------------------------
    f.write("-- POSTAL AREAS\n")
    rows = []
    postal_codes = []

    for i in range(NUM_POSTAL):
        code = f"N6G{str(i).zfill(3)}"
        city = fake.city()

        postal_codes.append(code)
        rows.append([f"'{code}'", f"'{city}'"])

        if len(rows) >= BATCH_SIZE:
            write_bulk_insert(f, "postalarea", ["PostalCode", "City"], rows)
            rows = []

    write_bulk_insert(f, "postalarea", ["PostalCode", "City"], rows)

    # ---------------------------------
    # ADMINISTRATORS
    # ---------------------------------
    f.write("-- ADMINISTRATORS\n")
    rows = []

    for i in range(1, NUM_ADMINS + 1):
        username = f"admin{i}_{fake.unique.user_name()}"
        email = fake.unique.email()
        password = fake.password()
        phone = clean_phone()
        role = random.choice(["Manager", "Supervisor", "Moderator", "Support"])

        rows.append([
            f"'{username}'",
            f"'{password}'",
            f"'{email}'",
            f"'{role}'",
            f"'{phone}'"
        ])

        if len(rows) >= BATCH_SIZE:
            write_bulk_insert(
                f, "administrator",
                ["Username", "Password", "Email", "Role", "PhoneNumber"],
                rows
            )
            rows = []

    write_bulk_insert(
        f, "administrator",
        ["Username", "Password", "Email", "Role", "PhoneNumber"], rows
    )

    # ---------------------------------
    # USERS
    # ---------------------------------
    fake_unique = Faker()
    f.write("-- USERS\n")
    rows = []

    for i in range(1, NUM_USERS + 1):
        username = f"user{i}_{fake.unique.user_name()}"
        email = fake.unique.email()
        password = fake.password()
        phone = clean_phone()
        vip = "TRUE" if random.random() < 0.1 else "FALSE"
        postal = random.choice(postal_codes)

        rows.append([
            f"'{username}'",
            f"'{email}'",
            f"'{password}'",
            f"'{phone}'",
            vip,
            f"'{postal}'"
        ])

        if len(rows) >= BATCH_SIZE:
            write_bulk_insert(
                f, "user",
                ["Username", "Email", "Password", "PhoneNumber", "VIP", "PostalCode"],
                rows
            )
            rows = []

    write_bulk_insert(
        f, "user",
        ["Username", "Email", "Password", "PhoneNumber", "VIP", "PostalCode"], rows
    )

    # ---------------------------------
    # EVENTS
    # ---------------------------------
    f.write("-- EVENTS\n")
    rows = []

    for i in range(1, NUM_EVENTS + 1):
        title = f"Event_{i}_{fake.word()}"
        category = random.choice(["Music", "Sports", "Theatre", "Conference", "Festival"])
        date = fake.date_between(start_date="-1y", end_date="+1y")
        admin = random.randint(1, NUM_ADMINS)
        price = round(random.uniform(10, 200), 2)
        desc = fake.sentence()
        location = fake.city()

        rows.append([
            f"'{title}'",
            f"'{category}'",
            f"'{date}'",
            str(price),
            f"'{desc}'",
            f"'{location}'",
            str(admin)
        ])

        if len(rows) >= BATCH_SIZE:
            write_bulk_insert(
                f, "event",
                ["Title", "Category", "Date", "BasePrice", "Description", "Location", "AdminID"],
                rows
            )
            rows = []

    write_bulk_insert(
        f, "event",
        ["Title", "Category", "Date", "BasePrice", "Description", "Location", "AdminID"], rows
    )

    # ---------------------------------
    # DISCUSSION BOARD
    # ---------------------------------
    f.write("-- DISCUSSION BOARD\n")
    rows = []

    for i in range(1, NUM_DISCUSSION + 1):
        title = fake.sentence(nb_words=4)
        content = fake.sentence()
        user_id = random.randint(1, NUM_USERS)
        event_id = random.randint(1, NUM_EVENTS)

        rows.append([
            f"'{title}'",
            f"'{content}'",
            str(user_id),
            str(event_id)
        ])

        if len(rows) >= BATCH_SIZE:
            write_bulk_insert(
                f, "discussionboard",
                ["Title", "Content", "UserID", "EventID"], rows
            )
            rows = []

    write_bulk_insert(
        f, "discussionboard",
        ["Title", "Content", "UserID", "EventID"], rows
    )

    # ---------------------------------
    # REPLIES (FK SAFE)
    # ---------------------------------
    f.write("-- REPLIES\n")
    rows = []

    for i in range(1, NUM_REPLY + 1):
        discussion_id = random.randint(1, NUM_DISCUSSION)
        user_id = random.randint(1, NUM_USERS)
        text = fake.sentence()

        if i <= 20:
            parent = "NULL"
        else:
            parent = "NULL" if random.random() < 0.7 else str(random.randint(1, i - 1))

        rows.append([
            str(discussion_id),
            str(user_id),
            parent,
            f"'{text}'"
        ])

        if len(rows) >= BATCH_SIZE:
            write_bulk_insert(
                f, "reply",
                ["DiscussionID", "UserID", "ParentReplyID", "Content"], rows
            )
            rows = []

    write_bulk_insert(
        f, "reply",
        ["DiscussionID", "UserID", "ParentReplyID", "Content"], rows
    )

    # ---------------------------------
    # TICKETS
    # ---------------------------------
    f.write("-- TICKETS\n")
    rows = []
    used_seats = set()

    for i in range(NUM_TICKETS):
        event_id = random.randint(1, NUM_EVENTS)
        user_id = random.randint(1, NUM_USERS)
        seat = f"{chr(ord('A') + random.randint(0, 15))}{random.randint(1, 60)}"

        if (event_id, seat) in used_seats:
            continue
        used_seats.add((event_id, seat))

        price = round(random.uniform(10, 300), 2)

        rows.append([
            str(event_id),
            str(user_id),
            f"'{seat}'",
            str(price)
        ])

        if len(rows) >= BATCH_SIZE:
            write_bulk_insert(
                f, "ticket",
                ["EventID", "UserID", "SeatNumber", "Price"], rows
            )
            rows = []

    write_bulk_insert(
        f, "ticket",
        ["EventID", "UserID", "SeatNumber", "Price"], rows
    )

    # ---------------------------------
    # PAYMENTS
    # ---------------------------------
    f.write("-- PAYMENTS\n")
    rows = []

    for i in range(NUM_PAYMENTS):
        amount = round(random.uniform(10, 300), 2)
        date = fake.date_this_year()
        ptype = random.choice(["Credit", "Debit", "Cash"])
        user_id = random.randint(1, NUM_USERS)
        event_id = random.randint(1, NUM_EVENTS)

        rows.append([
            str(amount),
            f"'{date}'",
            f"'{ptype}'",
            str(user_id),
            str(event_id)
        ])

        if len(rows) >= BATCH_SIZE:
            write_bulk_insert(
                f, "payment",
                ["Amount", "PaymentDate", "PaymentType", "UserID", "EventID"], rows
            )
            rows = []

    write_bulk_insert(
        f, "payment",
        ["Amount", "PaymentDate", "PaymentType", "UserID", "EventID"], rows
    )

    # ---------------------------------
    # WISHLIST
    # ---------------------------------
    f.write("-- WISHLIST\n")
    rows = []
    used_pairs = set()

    for i in range(NUM_WISHLIST):
        user_id = random.randint(1, NUM_USERS)
        event_id = random.randint(1, NUM_EVENTS)

        if (user_id, event_id) in used_pairs:
            continue
        used_pairs.add((user_id, event_id))

        rows.append([
            str(user_id),
            str(event_id),
            "NOW()"
        ])

        if len(rows) >= BATCH_SIZE:
            write_bulk_insert(
                f, "wishlist",
                ["UserID", "EventID", "DateAdded"], rows
            )
            rows = []

    write_bulk_insert(
        f, "wishlist",
        ["UserID", "EventID", "DateAdded"], rows
    )

    # ---------------------------------
    # REPORTS
    # ---------------------------------
    f.write("-- REPORTS\n")
    rows = []

    for i in range(NUM_REPORTS):
        admin_id = random.randint(1, NUM_ADMINS)
        event_id = random.randint(1, NUM_EVENTS)
        user_id = random.randint(1, NUM_USERS)

        rows.append([str(admin_id), str(event_id), str(user_id)])

        if len(rows) >= BATCH_SIZE:
            write_bulk_insert(
                f, "report",
                ["AdminID", "EventID", "UserID"], rows
            )
            rows = []

    write_bulk_insert(
        f, "report",
        ["AdminID", "EventID", "UserID"], rows
    )

print(f"Generated: {OUTPUT}")
