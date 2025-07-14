# Electrical Impedence Tomography (EIT) Diagnostic Imaging

**Project Description:** 

**[Electrical Impedence Tomography (EIT)](https://en.wikipedia.org/wiki/Electrical_impedance_tomography#)** Diagnostic Imaging is a biomedical imaging technique that is used to provide early screening of various lung, liver and kidney diseases. The product consists of an IoT device (**gateway**), electrodes belt, HDMI connection cable, a B2C mobile app, a B2B tablet app, and a backend hosted on GCP. The IoT device called Mediscan sends electrical signals to electrodes belt via the HDMI cable and uses [Time Difference EIT (TDEIT)](https://en.wikipedia.org/wiki/Electrical_impedance_tomography#:~:text=EIT%20measurements%20between%20two%20or,EIT%20(td%2DEIT).) and [Frequency Difference EIT (FDEIT)](https://pubmed.ncbi.nlm.nih.gov/18603667/) techniques to collect conductivity data of the organs. This data is transmitted via WiFi to the **TCP** server for storage in cloud. The raw data is then processed by the post-processing algorithms that convert them to the user-friendly diagnostic images and medical standard indicators. These results are presented to users via mobile applications. Core features of the mobile application include:
* Account creation, user authentication and authorization, and session management
* Localisation with 3 languages
* IoT device setup, registration, and management
* Clients/patients management for B2B users
* Electrodes belt wearing guide and troubleshooting guide
* User profile and tokens management
* Lung, liver, and kidney tests with subsessions in each test for different test paradigms. This also includes **data & communication protocol** setting for the IoT device along with feedback loop using **keepalive** and **ACK packets** for device status and error handling
* **In-app** test reports with diagnostic images and medical standard indicators for lung, liver, and kidney
* **PDF** report generation

System Design:

![System Design](https://github.com/Ebbi53/past_projects_demos/blob/master/%201.%20Electrical%20Impedence%20Tomography%20(EIT)%20Diagnostic%20Imaging/system_design.jpg)

The technical details are as follows:
* Firmware component uses C++ in MCU and python in [NanoPi](https://www.friendlyelec.com/index.php?route=product/product&product_id=304)
* Mobile and tablet applications uses React framework along with [Ionic](https://ionicframework.com/react), [Capacitor](https://capacitorjs.com/), and [Cordova](https://github.com/danielsogl/awesome-cordova-plugins).
    * They are distributed via Android Play Store and Apple App Store.
    * User authentication, authorization, and session management uses Google Firebase's [Auth](https://firebase.google.com/docs/auth) services
    * Localisation is done via [Locize](https://www.locize.com/) platform and React's [i18-next](https://www.i18next.com/) library
* The backend hosted on Google Cloud Platform (GCP) includes following components:
    * TCP server along with the postprocessing scientific algorithms uses python and is hosted on a VM (Virtual Machine)
        * [Multiprocessing](https://docs.python.org/3/library/multiprocessing.html) is implemented in the postprocessing algorithms for time-efficient processing and results generation
        * Diagnostic images generation uses matplotlib's [pyplot](https://matplotlib.org/3.5.3/api/_as_gen/matplotlib.pyplot.html) to generate SVGs which are further processed by the frontend side to make them localised
    * Microservices ([serverless functions](https://firebase.google.com/docs/functions)) uses NodeJS runtime
    * NoSQL databases via Google Firebase's [Firstore](https://firebase.google.com/docs/firestore) and [Realtime database](http://firebase.google.com/docs/database) services
    * PDF report generation uses [react-pdf](https://react-pdf.org/) node module to generate dynamic reports based on user and tests data

_Please note that due to copyright issues and the complexity of the project involving multiple components and modules, I cannot publish the code. Please contact me if you want to know more._

---

**Detailed App Demo:** *https://youtu.be/aOn8_NUtjGs (~15 minutes)*

**Product overview:** *https://youtu.be/mIgncHwx5og (~2 minutes)*

**Company Info:** *https://www.gensetechnologies.com/*