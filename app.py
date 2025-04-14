from flask import Flask, render_template, request, flash, redirect, url_for
from flask_mail import Mail, Message
from dotenv import load_dotenv
import os

app = Flask(__name__)
app.secret_key = os.urandom(24)

# Load environment variables
load_dotenv()

# Flask-Mail configuration
app.config['MAIL_SERVER'] = os.environ.get('MAIL_SERVER', 'smtp.gmail.com')
app.config['MAIL_PORT'] = int(os.environ.get('MAIL_PORT', 587))
app.config['MAIL_USE_TLS'] = os.environ.get('MAIL_USE_TLS', 'True') == 'True'
app.config['MAIL_USE_SSL'] = os.environ.get('MAIL_USE_SSL', 'False') == 'True'
app.config['MAIL_USERNAME'] = os.environ.get('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.environ.get('MAIL_PASSWORD')

# Validate email config
if not app.config['MAIL_USERNAME'] or not app.config['MAIL_PASSWORD']:
    print("Warning: MAIL_USERNAME or MAIL_PASSWORD not set. Contact form will fail.")

mail = Mail(app)

# Import data
from data import home_highlights, featured_projects, about_highlights, certifications, awards

@app.route('/')
def home():
    return render_template('home.html', highlights=home_highlights, featured_projects=featured_projects)

@app.route('/about')
def about():
    return render_template('about.html', highlights=about_highlights)

@app.route('/portfolio')
def portfolio():
    return render_template('portfolio.html')

@app.route('/achievements')
def achievements():
    return render_template('achievements.html', certifications=certifications, awards=awards)

@app.route('/contact', methods=['GET', 'POST'])
def contact():
    if request.method == 'POST':
        name = request.form.get('name')
        email = request.form.get('email')
        subject = request.form.get('subject')
        message = request.form.get('message')

        # Basic validation
        if not all([name, email, subject, message]):
            flash('All fields are required.', 'danger')
            return redirect(url_for('contact'))

        try:
            # Notification email to owner
            notify_msg = Message(
                subject=f"Contact Form: {subject}",
                sender=app.config['MAIL_USERNAME'],
                recipients=[app.config['MAIL_USERNAME']],
                reply_to=email
            )
            notify_msg.body = f"From: {name}\nEmail: {email}\n\n{message}"

            # Auto-reply email to submitter
            auto_reply = Message(
                subject='Thank You for Your Message',
                sender=app.config['MAIL_USERNAME'],
                recipients=[email]
            )
            auto_reply.html = render_template('email_template.html', name=name, subject=subject)

            # Send both emails
            with mail.connect() as conn:
                conn.send(notify_msg)
                conn.send(auto_reply)

            flash('Message sent successfully! You’ll receive a confirmation email.', 'success')
            return redirect(url_for('contact'))
        except Exception as e:
            flash(f'Failed to send message: {str(e)}', 'danger')
            return redirect(url_for('contact'))

    return render_template('contact.html')

@app.route('/asset-tracking')
def asset_tracking():
    return render_template('AssetTracking.html')  # Will 404 until file exists

@app.route('/active-directory')
def active_directory():
    return render_template('ActiveDirectory.html')  # Will 404 until file exists

if __name__ == '__main__':
    app.run(debug=True)