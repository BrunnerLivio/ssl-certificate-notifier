cd "$(dirname "$0")"
[ -e /var/log/ssl-certificate-notifier.log ] && rm /var/log/ssl-certificate-notifier.log

NODE_ENV=production /usr/bin/npm run start:checker >> /var/log/ssl-certificate-notifier.log>>/var/log/ssl-certificate-notifier.log 2>&1