CURRENT_DIR="$( cd "$(dirname "$0")" ; pwd -P )"
LIGHT_BLUE='\033[1;34m'
NC='\033[0m'
cd $CURRENT_DIR
echo -e "${LIGHT_BLUE}Installing NPM packages..${NC}"
npm install

echo -e "${LIGHT_BLUE}Adding cronjob..${NC}"

sudo crontab -l > sslCertificateNotifierCron
# https://crontab.guru/#*/5_*_*_*_*
echo "*/5 * * * * ${CURRENT_DIR}/run-checker-prod.sh" >> sslCertificateNotifierCron
sudo crontab sslCertificateNotifierCron
rm sslCertificateNotifierCron