import tkinter as tk
from tkinter import ttk, messagebox
from app import (
    firebase_sign_in,
    fetch_friend_uids,
    fetch_username,
    run_detection_loop
)

class RTSLTranslatorApp:
    def __init__(self):
        self.id_token = None
        self.my_uid = None
        self.friend_uids = []
        self.friend_labels = []
        self.root = tk.Tk()
        self.root.title("RTSL Translator")
        self._set_theme()
        self._center_window(self.root, 400, 220)
        self._build_login_ui()
        self.root.mainloop()

    def _set_theme(self):
        style = ttk.Style(self.root)
        style.theme_use('clam')
        style.configure('TButton', padding=6)
        style.configure('TEntry', padding=4)
        style.configure('TLabel', padding=4)

    def _center_window(self, win, width, height):
        sw, sh = win.winfo_screenwidth(), win.winfo_screenheight()
        x = (sw - width) // 2
        y = (sh - height) // 2
        win.geometry(f"{width}x{height}+{x}+{y}")

    def _build_login_ui(self):
        frame = ttk.Frame(self.root, padding=20)
        frame.pack(expand=True, fill='both')

        ttk.Label(frame, text="Firebase Email:").grid(row=0, column=0, sticky='w')
        self.email_var = tk.StringVar()
        ttk.Entry(frame, textvariable=self.email_var, width=32).grid(row=1, column=0, pady=(0,10))

        ttk.Label(frame, text="Firebase Password:").grid(row=2, column=0, sticky='w')
        self.pass_var = tk.StringVar()
        ttk.Entry(frame, textvariable=self.pass_var, show="*", width=32).grid(row=3, column=0, pady=(0,10))

        login_btn = ttk.Button(frame, text="Login & Continue", command=self.on_login)
        login_btn.grid(row=4, column=0, pady=10)
        self.root.bind('<Return>', lambda e: self.on_login())

    def on_login(self):
        email = self.email_var.get().strip()
        password = self.pass_var.get().strip()
        if not email or not password:
            messagebox.showwarning("Missing Info", "Please enter both email and password.")
            return

        try:
            self.id_token, self.my_uid = firebase_sign_in(email, password)
        except Exception as e:
            messagebox.showerror("Login Failed", str(e))
            return

        # fetch friends
        self.friend_uids = fetch_friend_uids(self.id_token, self.my_uid)
        if not self.friend_uids:
            messagebox.showinfo("No Friends", "You have no friends in your list.")
            return

        self.friend_labels = [fetch_username(self.id_token, uid) for uid in self.friend_uids]
        self.root.destroy()
        self.show_friend_selection()

    def show_friend_selection(self):
        sel_win = tk.Tk()
        sel_win.title("Select Friend to Chat")
        self._center_window(sel_win, 350, 150)

        frame = ttk.Frame(sel_win, padding=20)
        frame.pack(expand=True, fill='both')

        ttk.Label(frame, text="Select a friend:").grid(row=0, column=0, sticky='w')
        combo = ttk.Combobox(frame, values=self.friend_labels, state="readonly", width=30)
        combo.current(0)
        combo.grid(row=1, column=0, pady=10)

        def start_detection():
            idx = combo.current()
            sel_win.destroy()
            # Launch translation loop; on ESC return here
            run_detection_loop(self.id_token, self.my_uid, self.friend_uids[idx])
            # After loop exits (ESC pressed), go back to selection
            self.show_friend_selection()

        start_btn = ttk.Button(frame, text="Start Detection", command=start_detection)
        start_btn.grid(row=2, column=0, pady=5)

        sel_win.bind('<Return>', lambda e: start_btn.invoke())
        sel_win.mainloop()

if __name__ == '__main__':
    RTSLTranslatorApp()
