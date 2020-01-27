# Jardines Aplications' Data parser for IBM Watson

**Project Description:** A parsing script written in **JavaScript using NodeJS** to parse the applications data (Jardine Scholarships, Jardine Executive Training Scheme, Jardine Internships) originally in JSON format. It's performing the following tasks:

1. Collecting user-defined variables
2. **Cleaning** the data fetched from MySQL database
3. Parsing the **JSON** data into **CSV** format with the schema specified by the IBM team
4. Converting different formats (word documents and images) of candidates' resumes/CVs into PDF format using [libreOffice](https://www.libreoffice.org/)
5. Generating some statistics of the parsing process
6. Archiving and Uploading the parsed data to IBM servers using sFTP for further processing using [ArchiveJS](https://www.archiverjs.com/archiver) and [node-ssh](https://www.npmjs.com/package/node-ssh) modules respectively.

---

**Contributions/Ownership:** 99% mine

![Screen Capture](https://github.com/Ebbi53/past_projects_demos/blob/master/2.%20Applications'%20Data%20Parser/Screenshot%202020-01-25%20at%201.50.29%20AM.png)
