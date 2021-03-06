from app import db

from app.main import bp
from app.main.forms import LoginForm, RegistrationForm
from app.main.models import User

from app.thermocontrol.models import  WebTempControl, wtcs_schema
from app.cameracontrol.models import Camera

from flask import render_template, flash, redirect, url_for, session

from flask_login import current_user, login_user, logout_user
import json

@bp.route('/')
@bp.route('/index', methods=['GET', 'POST'])
def index():
    '''
    The main function for rendering the principal site.
    '''
    if current_user.is_authenticated:
        wtcontrols = WebTempControl.query.filter_by(user_id = current_user.id).all();
        n_wtcs = WebTempControl.query.filter_by(user_id = current_user.id).count();
    else:
        wtcontrols = WebTempControl.query.all();
        n_wtcs = WebTempControl.query.count();


    cams = Camera.query.all();
    n_cameras = len(cams);

    wtc_json = json.dumps(wtcs_schema.dump(wtcontrols));
    return render_template('index.html', n_wtcs = n_wtcs, wtempcontrols = wtcontrols,
        wtc_json = wtc_json, n_cameras = n_cameras, cameras = cams);

@bp.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('main.index'))
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(username=form.username.data).first()
        if user is None or not user.check_password(form.password.data):
            flash('Invalid username or password')
            return redirect(url_for('main.login'))
        login_user(user, remember=form.remember_me.data)
        return redirect(url_for('main.index'))
    return render_template('login.html', title='Sign In', form=form)

@bp.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('main.index'))

@bp.route('/register', methods=['GET', 'POST'])
def register():
    if current_user.is_authenticated:
        return redirect(url_for('index'))
    form = RegistrationForm()
    if form.validate_on_submit():
        user = User(username=form.username.data, email=form.email.data)
        user.set_password(form.password.data)
        db.session.add(user)
        db.session.commit()
        flash('Congratulations, you are now a registered user!')
        return redirect(url_for('main.login'))
    return render_template('register.html', title='Register', form=form)
