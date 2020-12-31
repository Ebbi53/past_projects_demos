# Information Extender

**Project Description:** 
* A web application to make any type of document (resumes, essays, research papers) easily understandable and readable. The detailed steps of this process includes:
   1. Parse the document to extract the data using [resume-parser](https://www.npmjs.com/package/resume-parser) npm module.
   2. Identify and extract the interesting and difficult keywords from that data using a predefined list of keywords stored at the backend.
        * This predefined list was compiled by using different relevant datasets from the internet and then cleaning the final combined dataset.
   3. Highlight these identified keywords on the document as clickable links and present this updated document on the frontend using  npm module named [pdf2htmlEX](https://coolwanglu.github.io/pdf2htmlEX/) for PDFs and [mammoth](https://www.npmjs.com/package/mammoth) for Word documents.
   4. On click of any of these keywords, perform a Google search using **[Google Search API](https://developers.google.com/custom-search)** and get Google News and Google Trends information using **[google-news-rss](https://www.npmjs.com/package/google-news-rss)** and **[google-trends-api](https://www.npmjs.com/package/google-trends-api)** npm modules respectively.

* The **Backend** of the application i.e. the **web-server** and **server-side** scripts are setup using **[NodeJS](https://nodejs.org/en/)** along with the **[ExpressJS](https://expressjs.com/)**.
* Did **[end-to-end development](http://www.rapidsofttechnologies.com/end-to-end-website-development.php)** and developed this first workable prototype in about 2 weeks.

*Please note that I have attached a recording (GIF) for demonstration. If you want to have a proper look at the video, please either watch it **[here](https://youtu.be/J3Zl_vkWg_o)** or download the **.mp4** video file from above.*

---

**Demo:**

![Screen Recording](https://github.com/Ebbi53/past_projects_demos/blob/master/%203.%20Info-Extender/Screen%20Recording%202020-01-28%20at%201.11.51%20AM.gif)

*YouTube: https://youtu.be/J3Zl_vkWg_o*

---

**Contributions/Ownership:** 100% mine

![Screen Capture](https://github.com/Ebbi53/past_projects_demos/blob/master/%203.%20Info-Extender/Screenshot%202020-01-28%20at%204.49.23%20PM.png)
