import os

from cs50 import SQL
from flask import Flask, flash, redirect, render_template, request, session
from flask_session import Session
from werkzeug.security import check_password_hash, generate_password_hash

from helpers import apology, login_required, lookup, usd

# Configure application
app = Flask(__name__)

# Custom filter
app.jinja_env.filters["usd"] = usd

# Configure session to use filesystem (instead of signed cookies)
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

# Configure CS50 Library to use SQLite database
db = SQL("sqlite:///finance.db")


@app.after_request
def after_request(response):
    """Ensure responses aren't cached"""
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"
    return response


@app.route("/")
@login_required
def index():
    """Show portfolio of stocks"""
    try:
        cash = db.execute("SELECT cash FROM users WHERE id=?",
                          (session["user_id"], ))[0]["cash"]
        profolio = db.execute(
            "SELECT symbol, SUM(shares) FROM history WHERE buyer_id=? GROUP BY symbol", session["user_id"])
    except:
        return apology("Database has something wrong, please try again")

    profolio_value = 0
    for stock in profolio:
        price = lookup(stock["symbol"])["price"]
        stock["price"] = usd(price)
        stock_value = price * stock["SUM(shares)"]
        stock["total_value"] = usd(stock_value)
        profolio_value += stock_value
    print(cash, type(cash), profolio_value, type(profolio_value))

    total_value = usd((cash + profolio_value))
    return render_template("index.html", cash=usd(cash), data=profolio, total=total_value)


@app.route("/buy", methods=["GET", "POST"])
@login_required
def buy():
    """Buy shares of stock"""
    if request.method == "POST":
        symbol = request.form.get("symbol")
        shares = request.form.get("shares")

        if not symbol:
            return apology("Symbol should not be blank.")
        else:
            data = lookup(symbol)
            try:
                price = data["price"]
            except TypeError:
                return apology("The symbol is not exist.")

        if not shares:
            return apology("Shares should not be blank.")

        try:
            if not shares.isdigit() or int(shares) < 0:
                return apology("Shares should be integer and at least 1.")
            shares = int(shares)
        except ValueError:
            return apology("Shares should be number.")

        # Fetching data
        try:
            cash = db.execute(
                "SELECT cash FROM users WHERE id = ?", session["user_id"])[0]["cash"]
            total_price = price * shares
        except ValueError:
            return apology("Something wrong, please try again")

        # Buy process
        if cash > total_price:
            try:
                new_cash = cash - total_price
                db.execute("INSERT INTO history (buyer_id, symbol, trade, shares, price) VALUES (?, ?, ?, ?, ?)",
                           session["user_id"], symbol, "Buy", shares, price)
                db.execute("UPDATE users SET cash = ? WHERE id = ?",
                           new_cash, session["user_id"])
            except:
                return apology("Buying process is wrong, please try again")
        else:
            return apology("There's not enough cash.")

        flash("Brought")
        return redirect("/")

    return render_template("buy.html")


@app.route("/history")
@login_required
def history():
    """Show history of transactions"""
    try:
        data = db.execute("SELECT * FROM history")
        for i in data:
            i["name"] = db.execute(
                "SELECT username FROM users WHERE id = ?", i["buyer_id"])[0]["username"]
            i["price"] = usd(i["price"])
    except:
        return apology("Something wrong, please try again")
    return render_template("history.html", data=data)


@app.route("/login", methods=["GET", "POST"])
def login():
    """Log user in"""

    # Forget any user_id
    session.clear()

    # User reached route via POST (as by submitting a form via POST)
    if request.method == "POST":
        # Ensure username was submitted
        if not request.form.get("username"):
            return apology("must provide username", 403)

        # Ensure password was submitted
        elif not request.form.get("password"):
            return apology("must provide password", 403)

        # Query database for username
        rows = db.execute("SELECT * FROM users WHERE username = ?", request.form.get(
            "username"))

        # Ensure username exists and password is correct
        if len(rows) != 1 or not check_password_hash(
            rows[0]["hash"], request.form.get("password")
        ):
            return apology("invalid username and/or password", 403)

        # Remember which user has logged in
        session["user_id"] = rows[0]["id"]

        # Redirect user to home page
        return redirect("/")

    # User reached route via GET (as by clicking a link or via redirect)
    else:
        return render_template("login.html")


@app.route("/logout")
def logout():
    """Log user out"""

    # Forget any user_id
    session.clear()

    # Redirect user to login form
    return redirect("/")


@app.route("/quote", methods=["GET", "POST"])
@login_required
def quote():
    """Get stock quote."""
    if request.method == "POST":
        symbol = request.form.get("symbol")
        if not symbol:
            return apology("Symbol should not be blank.")

        try:
            data = lookup(symbol)
            data["price"] = usd(data["price"])
            if data == None:
                return apology("The Symbol is not valid.")
        except:
            return apology("Something went wrong.")

        return render_template("quoted.html", data=data)

    return render_template("quote.html")


@app.route("/register", methods=["GET", "POST"])
def register():
    """Register user"""
    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")
        confirmation = request.form.get("confirmation")
        if not username:
            return apology("Username can not be blank.")
        if not password:
            return apology("Password can not be blank.")
        if not confirmation:
            return apology("Confirmation can not be blank.")

        if not (password == confirmation):
            return apology("Password not match.")

        try:
            db.execute("INSERT INTO users (username, hash) VALUES (?, ?)",
                       username, generate_password_hash(password))
        except ValueError:
            return apology("User is already registered.")

        return redirect("/")
    else:
        return render_template("register.html")


@app.route("/sell", methods=["GET", "POST"])
@login_required
def sell():
    """Sell shares of stock"""
    if request.method == "POST":
        symbol = request.form.get("symbol")
        shares = request.form.get("shares")
        if not symbol:
            return apology("Symbol should not be blank.")
        else:
            stock_data = lookup(symbol)
            try:
                price = stock_data["price"]
            except ValueError:
                return apology("Symbol is not exist.")

        if not shares:
            return apology("Shares should not be blank.")
        else:
            try:
                shares = int(shares)
                if shares < 0:
                    return apology("Shares should be at least 1.")
            except ValueError:
                return apology("Shares should be number.")

        # Fetching data
        try:
            cash = db.execute("SELECT cash FROM users WHERE id = ?", session["user_id"])[
                0]["cash"]
            own_shares = db.execute(
                "SELECT SUM(shares) FROM history WHERE buyer_id = ? AND symbol = ? GROUP BY symbol", session["user_id"], symbol)[0]["SUM(shares)"]

            total_price = shares * price
        except ValueError:
            return apology("Something wrong, please try again")

        # Sell process
        if shares < own_shares:
            try:
                new_cash = cash + total_price
                db.execute("INSERT INTO history (buyer_id, symbol, trade, shares, price) VALUES (?, ?, ?, ?, ?)",
                           session["user_id"], symbol, "Sell", -shares, price)
                db.execute("UPDATE users SET cash = ? WHERE id = ?",
                           new_cash, session["user_id"])
            except:
                return apology("Something wrong, please try again")
        else:
            return apology("There's not enough shares.")

        flash("Sell")
        return redirect("/")

    try:
        data = db.execute(
            "SELECT symbol FROM history WHERE buyer_id = ? GROUP BY symbol", session["user_id"])
        print(data)
    except:
        return apology("Something wrong, please try again")

    return render_template("sell.html", data=data)
