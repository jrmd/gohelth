server {
    listen 80;
    server_name go.helth.lol;

    location / {
        return 301 https://$host$request_uri;
    }

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
}

server {
    listen 443 ssl;
    server_name go.helth.lol;

    ssl_certificate /etc/letsencrypt/live/go.helth.lol/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/go.helth.lol/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    location / {
        proxy_pass localhost:8000; #for demo purposes
    }
}

