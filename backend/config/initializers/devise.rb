# frozen_string_literal: true

# Assuming you have not yet modified this file, each configuration option below
# is set to its default value. Note that some are commented out while others
# are not: uncommented lines are intended to protect your configuration from
# breaking changes in upgrades (i.e., in the event that future versions of
# Devise change the default values for those options).
#
# Use this hook to configure devise mailer, warden hooks and so forth.
# Many of these configuration options can be set straight in your model.

Devise.setup do |config|
  # The secret key used by Devise. Devise uses this key to generate
  # random tokens. Changing this key will render invalid all existing
  # confirmation, reset password and unlock tokens in the database.
  # Devise will use the `secret_key_base` as its `secret_key` by default.
  # You can change it below and use your own secret key.
  # config.secret_key = '...'

  # ==> Mailer Configuration
  config.mailer_sender = 'please-change-me-at-config-initializers-devise@example.com'

  # Load and configure the ORM. Supports :active_record (default) and :mongoid by default.
  require 'devise/orm/active_record'

  # ==> Configuration for any authentication mechanism
  config.case_insensitive_keys = [:email]
  config.strip_whitespace_keys = [:email]

  config.skip_session_storage = [:http_auth, :params_auth]

  config.stretches = Rails.env.test? ? 1 : 12

  config.reconfirmable = true

  config.expire_all_remember_me_on_sign_out = true

  config.password_length = 6..128

  config.reset_password_within = 6.hours

  config.navigational_formats = []
  config.sign_out_via = :delete

  config.responder.error_status = :unprocessable_entity
  config.responder.redirect_status = :see_other

  # ==> JWT configuration
  config.jwt do |jwt|
    jwt.secret = ENV['DEVISE_JWT_SECRET_KEY'] || Rails.application.credentials.devise_jwt_secret_key
    jwt.dispatch_requests = [
      ['POST', %r{^/api/v1/login$}]
    ]
    jwt.revocation_requests = [
      ['DELETE', %r{^/api/v1/logout$}]
    ]
    jwt.expiration_time = 1.day.to_i
  end
end
