
var App = (function () {

    let Main = {};

    let store = window.localStorage;

    Main = {
		/*-----
			Function: Initializes the Mainlication
		-----*/
        init: function () {
            let input = document.getElementById("fileURL");
            input.addEventListener("change", Main.setDate);

            Main.getAllFiles();
        },

        data: JSON.parse(store.getItem("newFiles")) || [],

        createfile: () => {
            let obj = {
                name: "File",
                size: "6000",
                type: "txt",
                data: "today",
            };
            let newObj = Main.data.push(obj);
            store.setItem("newFiles", JSON.stringify(newObj));
        },

        setDate: (e) => {
            let files = e.target.files;

            Main.data = [];
            store.clear();

            for (let i = 0; i < files.length; i++) {
                let date = new Date();

                Main.data.push({
                    id: i,
                    name: files[i].name,
                    size: files[i].size,
                    type: files[i].type || "none",
                });
            };

            let arrToStore = JSON.stringify(Main.data);
            store.setItem("newFiles", arrToStore);
            Main.getAllFiles();
        },

        getAllFiles: function () {
            let tbody = document.getElementById('output'); // gets the container element
            tbody.innerHTML = ''; // resets the list to nothing

            Main.data.map(files => {
                let tr = document.createElement('tr');
                tr.setAttribute("id", "" + files.id + "");
                let parseName = Main.utility.parseName(files.name);
                let parseSize = Main.utility.parseSize(files.size);

                let fileName = document.createElement('td'); // NAme element
                let fileSize = document.createElement('td'); // NAme element
                let fileType = document.createElement('td'); // NAme element

                fileName.appendChild(document.createTextNode(parseName));
                fileSize.appendChild(document.createTextNode(parseSize));
                fileType.appendChild(document.createTextNode(files.type));

                tr.className = 'file'; // add class
                tr.appendChild(fileName);
                tr.appendChild(fileSize);
                tr.appendChild(fileType);

                tbody.appendChild(tr);
            })
        },


        getElement: (e) => {
            console.log(e.target);
        },

        /*-----
            Function: Deletes a file
        -----*/
        deleteFile: function (el) {
            let i = 0;
            Main.data.find(element => {
                if (element.id == el) {
                    i = Main.data.indexOf(element);
                }
            });

            Main.utility.returnError(`File ${Main.data[i].name} was deleted.`);

            Main.data.splice(i, 1); // remove file from data array
            store.setItem("newFiles", JSON.stringify(Main.data));
            Main.getAllFiles();
        },

        addFile: () => {
            let now = new Date;
            let hour = now.getTime();
            let res = prompt("Plz write file name like example.txt!");

            let name = res.toString();
            let notFound = res.indexOf(".");


            if (name.length <= 0 || notFound == -1) {
                Main.utility.returnError("Please enter Correct Name")

            }

            else {

                let name = res.slice(0, res.indexOf("."));
                let fileExecution = res.slice(res.indexOf(".") + 1);

                Main.data.unshift({
                    id: hour,
                    name: name,
                    size: 125,
                    type: fileExecution
                });

                Main.utility.returnError(`File ${res} was added.`);
            }

            store.setItem("newFiles", JSON.stringify(Main.data));
            Main.getAllFiles();
        },

        renameFile: (el) => {
            let i = 0;
            let newName;
            Main.data.find(element => {
                if (element.id == el) {
                    i = Main.data.indexOf(element);
                    newName = prompt("Enter the new file name!");
                    if (newName.length > 0) {
                        Main.data[i].name = newName;
                    }

                    Main.utility.returnError("File was renamed.");
                }
            });

            store.setItem("newFiles", JSON.stringify(Main.data));
            Main.getAllFiles();
        },

        utility: {
            /*-----
                Function: Grabs element based on attribute from the entire page
            -----*/
            getElementByAttribute: attribute => {
                let everything = document.getElementsByTagName('*');
                let matchingElements = [];

                for (let i = 0; i < everything.length; i++) {
                    if (everything[i].getAttribute(attribute)) {
                        matchingElements.push(everything[i]);
                    }
                }
                return matchingElements;
            },

            /*-----
            Function: Parse file size
            -----*/
            parseSize: bytes => {
                let sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
                if (bytes == 0) return '0 Byte';
                let i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
                return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
            },

            returnError: text => {

                let tip = document.getElementById("tip");
                if (text) {
                    tip.className = "show";
                    tip.innerHTML = text;

                    setTimeout(function () { tip.className = tip.className.replace("show", ""); }, 3000);

                }
                else {
                    console.log("ass");
                }
            },

            parseName: name => {
                let a;
                name.length > 12 ? a = `${name.slice(0, 12)}...` : a = name;
                return a;
            }
        }
    }

    Main.init(); // initialize the Main

    return {
        deleteFile: Main.deleteFile,
        addFile: Main.addFile,
        renameFile: Main.renameFile,
    };
})();

