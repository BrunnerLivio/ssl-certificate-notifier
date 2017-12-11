echo -e "${LIGHT_BLUE}Removing cronjob..${NC}"
sudo crontab -l | grep -v '/run-checker-prod.sh'  | crontab -