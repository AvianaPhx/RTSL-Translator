# GUI.py
import tkinter as tk
from tkinter import ttk, messagebox
from app import (
    firebase_sign_in,
    fetch_friend_uids,
    fetch_username,
    run_detection_loop
)

def on_login():
    email = email_var.get().strip()
    password = pass_var.get().strip()
    try:
        id_token, my_uid = firebase_sign_in(email, password)
    except Exception as e:
        messagebox.showerror("Login Failed", str(e))
        return

    friends = fetch_friend_uids(id_token, my_uid)
    if not friends:
        messagebox.showinfo("No Friends", "You have no friends in your list.")
        return

    labels = [fetch_username(id_token, uid) for uid in friends]
    login_win.destroy()
    show_friend_selection(id_token, my_uid, friends, labels)

def show_friend_selection(id_token, my_uid, friend_uids, friend_labels):
    sel_win = tk.Tk()
    sel_win.title("Select Friend to Chat")

    tk.Label(sel_win, text="Select a friend:").pack(pady=8)
    combo = ttk.Combobox(sel_win, values=friend_labels, state="readonly")
    combo.current(0)
    combo.pack(padx=20, pady=10)

    def start_detection():
        idx = combo.current()
        sel_win.destroy()
        run_detection_loop(id_token, my_uid, friend_uids[idx])

    tk.Button(sel_win, text="Start Detection", command=start_detection).pack(pady=12)
    sel_win.mainloop()

# ———— Login Window ————
login_win = tk.Tk()
login_win.title("RTSL Translator Login")

tk.Label(login_win, text="Firebase Email:").pack(pady=(10,0))
email_var = tk.StringVar()
tk.Entry(login_win, textvariable=email_var, width=30).pack(pady=4)

tk.Label(login_win, text="Firebase Password:").pack(pady=(10,0))
pass_var = tk.StringVar()
tk.Entry(login_win, textvariable=pass_var, show="*", width=30).pack(pady=4)

tk.Button(login_win, text="Login & Continue", command=on_login).pack(pady=15)
login_win.mainloop()
