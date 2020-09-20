module.exports = {
  "type": "service_account",
  "project_id": process.env.project_id_firebase,
  "private_key_id": process.env.private_key_id_firebase,
  "private_key": (process.env.private_key_firebase).replace(/\\n/g, '\n'),
  "client_email": process.env.client_email_firebase,
  "client_id": process.env.client_id_firebase,
  "auth_uri": process.env.auth_uri_firebase,
  "token_uri": process.env.token_uri_firebase,
  "auth_provider_x509_cert_url": process.env.auth_provider_x509_cert_url_firebase,
  "client_x509_cert_url": process.env.client_x509_cert_url_firebase
  }