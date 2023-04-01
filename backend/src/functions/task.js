const fs = require("fs");
const path = require("path");
const cookie = require('cookie');
const Auth = require("../services/auth");

const headers = {
  'Content-Type': 'application/json',
  "Access-Control-Allow-Origin": '*',
  'Access-Control-Allow-Credentials': true
};
const filePath = "/tmp/tasks.json";
// const filePath = path.join(__dirname, "tasks.json");

function getOrigin(event) {
  return event && event.headers && event.headers["Origin"] || event.headers["origin"] || "*";
}

function getTasksFromJSONFile() {
  // Check if file exists
  if (!fs.existsSync(filePath)) {
    // If file does not exist, create empty array and write to file
    const emptyTasks = [];
    fs.writeFileSync(filePath, JSON.stringify(emptyTasks));
  }

  // Read file and parse JSON data
  const data = fs.readFileSync(filePath, "utf8");
  const tasks = JSON.parse(data);

  return tasks;
}

function writeTasksToJSONFile(tasks) {
  fs.writeFileSync(filePath, JSON.stringify(tasks));

  // Read file and parse JSON data
  const data = fs.readFileSync(filePath, "utf8");
  const updatedTasks = JSON.parse(data);

  return updatedTasks;
}

function updateTaskToJSONFile(taskId, newTaskData) {
  // Read file and parse JSON data
  let data = fs.readFileSync(filePath, "utf8");
  let tasks = JSON.parse(data);

  tasks = tasks.map((task) => {
    if (task.id === taskId) {
      return {...task, ...newTaskData};
    } else {
      return {...task};
    }
  });

  fs.writeFileSync(filePath, JSON.stringify(tasks));

  // Read file and parse JSON data
  data = fs.readFileSync(filePath, "utf8");
  const updatedTasks = JSON.parse(data);

  return updatedTasks;
}

function removeTaskFromJSONFile(taskId) {
  // Read file and parse JSON data
  let data = fs.readFileSync(filePath, "utf8");
  let tasks = JSON.parse(data);

  tasks = tasks.filter((task) => task.id !== taskId);

  fs.writeFileSync(filePath, JSON.stringify(tasks));

  // Read file and parse JSON data
  data = fs.readFileSync(filePath, "utf8");
  const updatedTasks = JSON.parse(data);

  return updatedTasks;
}

async function cookieVerify(event) {
  let isValidCookie = false;
  if (event && event.headers && (event.headers["Cookie"] || event.headers["cookie"])) {
    let {token} = cookie.parse(event.headers["Cookie"] || event.headers["cookie"]);
    let data = Auth.verifyJWT(token).catch(() => {
      isValidCookie = false;
    })
    if (data) {
      isValidCookie = true;
    }
  }
  return isValidCookie;
}

module.exports.createTask = async (event, ctx, cb) => {

  let valid = await cookieVerify(event);
  if (!valid) {
    return {
      statusCode: 401,
      headers: {
        ...headers,
        "Access-Control-Allow-Origin": getOrigin(event)
      },
      body: JSON.stringify({message: "Unauthorized"})
    };
  }

  let tasks = getTasksFromJSONFile();

  const {taskName, description} = JSON.parse(event.body);
  let newTask = {
    id: new Date().getTime().toString(),
    taskName,
    description,
    completed: false,
  };

  tasks.push(newTask);
  let updatedTasks = writeTasksToJSONFile(tasks);

  cb(null, {
    statusCode: 200,
    headers: {
      ...headers,
      "Access-Control-Allow-Origin": getOrigin(event)
    },
    body: JSON.stringify(updatedTasks)
  });
};

module.exports.listTask = async (event, ctx, cb) => {
  let valid = await cookieVerify(event);
  if (!valid) {
    return {
      statusCode: 401,
      headers: {
        ...headers,
        "Access-Control-Allow-Origin": getOrigin(event)
      },
      body: JSON.stringify({message: "Unauthorized"})
    };
  }

  let tasks = getTasksFromJSONFile();

  cb(null, {
    statusCode: 200,
    headers: {
      ...headers,
      "Access-Control-Allow-Origin": getOrigin(event)
    },
    body: JSON.stringify(tasks)
  });

};

module.exports.removeTask = async (event, ctx, cb) => {
  let valid = await cookieVerify(event);
  if (!valid) {
    return {
      statusCode: 401,
      headers: {
        ...headers,
        "Access-Control-Allow-Origin": getOrigin(event)
      },
      body: JSON.stringify({message: "Unauthorized"})
    };
  }
  const {taskId} = event.pathParameters;
  let tasks = removeTaskFromJSONFile(taskId);
  cb(null, {
    statusCode: 200,
    headers: {
      ...headers,
      "Access-Control-Allow-Origin": getOrigin(event)
    },
    body: JSON.stringify(tasks)
  });
};

module.exports.changeTaskStatus = async (event, ctx, cb) => {
  let valid = await cookieVerify(event);
  if (!valid) {
    return {
      statusCode: 401,
      headers: {
        ...headers,
        "Access-Control-Allow-Origin": getOrigin(event)
      },
      body: JSON.stringify({message: "Unauthorized"})
    };
  }
  const {taskId, completed} = event.pathParameters;

  let tasks = getTasksFromJSONFile();

  let foundTask = tasks.find((task) => task.id === taskId);
  if (!foundTask) {
    return {
      statusCode: 404,
      headers: {
        ...headers,
        "Access-Control-Allow-Origin": getOrigin(event)
      },
      body: JSON.stringify({message: "Task not found"}),
    };
  }

  let updatedTasks = updateTaskToJSONFile(taskId, {
    completed: completed === "true",
  });

  cb(null, {
    statusCode: 200,
    headers: {
      ...headers,
      "Access-Control-Allow-Origin": getOrigin(event)
    },
    body: JSON.stringify(updatedTasks),
  });
};
