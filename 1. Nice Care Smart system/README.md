# Nice Care Smart system

**Project Description:** 

Nice Care Smart system is a B2B product comprising of a web portal and a mobile app targeting nursing homes and hospitals. Underneath, the IoT solution consists of a healthcare wearable device (i.e. **diaper sensor**), a **gateway** (Hub), and a virtual server hosted on the cloud. The system operates with the **BLE** (Bluetooth Low Energy) and Wi-Fi transmission protocol and allows monitoring of users’ physiological data. The web portal provides an overview of all the elderly in the facility with detailed information regarding their diaper wetness level, accidental falls, posture and more. Other features include: 
* All in one data management platform with information on **diaper stock, diaper usage and incident management actions** for the nursing home. 
* Real-time 24 hour data on *incontinence and posture for better rehab* and *pressure & wound care* to analyse the needs of individual elderlies. 
* Data analytics on diaper usage and void trends to draw insights and patterns based on previously recorded information.

Sysetm Design:

[Sysetm Design](https://github.com/Ebbi53/past_projects_demos/blob/master/%201.%20Nice%20Care%20Smart%20system/system%20design.jpg)

The techinical details are as follows:
* Using [LEMP Stack](https://lempstack.com/) (Linux, Nginx, MySQL, PHP) hosted on **[AWS EC2](https://aws.amazon.com/ec2/)**
    * **[NGINX](https://www.nginx.com/)** as a WebServer and reverse proxy for load balancing and filtering out requests.
    * **[MySQL](https://www.mysql.com/)** for a relational SQL database hosted locally
    * **[PHP](https://www.php.net/)** via [php-fpm](https://www.php.net/manual/en/install.fpm.php) with PHP MVC framework, **[CodeIgniter](https://codeigniter.com/)**, to dynamically generate webpages based on the routes.
    * Using [Swoole framework](https://www.swoole.co.uk/) to establish a **TCP** communication channel between the IoT sensor and the WebServer and also a __WebSocket__ communication channel between the server and the frontend UI.

*Note: Due to copyright issues, I cannot publicly publish the code. Please contact me if you want to know more.*

---

**Demo:**

![Screen Recording](https://github.com/Ebbi53/past_projects_demos/blob/master/%201.%20Nice%20Care%20Smart%20system/demo.gif)

*YouTube: https://youtu.be/63Z5-OhUqBo*
