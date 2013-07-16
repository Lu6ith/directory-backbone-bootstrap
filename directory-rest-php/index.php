<?php
require 'Slim/Slim.php';
use Slim\Slim;

\Slim\Slim::registerAutoloader();

$app = new \Slim\Slim();

$app->get('/employees', 'getEmployees');
$app->get('/employees/:id', 'getEmployee');
$app->get('/employees/:id/reports', 'getReports');
$app->delete('/employees/:id',	'delEmployee');
$app->put('/employees/:id', 'updateEmployee');
$app->post('/employees', 'addEmployee');

$app->run();

function getEmployees() {

    if (isset($_GET['name'])) {
        return getEmployeesByName($_GET['name']);
    } else if (isset($_GET['modifiedSince'])) {
        return getModifiedEmployees($_GET['modifiedSince']);
    }

    $sql = "select e.id, e.firstName, e.lastName, e.title, e.officePhone, e.cellPhone, e.email, e.tags, count(r.id) reportCount " .
            "from employee e left join employee r on r.managerId = e.id " .
            "group by e.id order by e.lastName, e.firstName";
    try {
        $db = getConnection();
        $stmt = $db->query($sql);
        $employees = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;

        // Include support for JSONP requests
        if (!isset($_GET['callback'])) {
            echo json_encode($employees);
        } else {
            echo $_GET['callback'] . '(' . json_encode($employees) . ');';
        }

    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
    echo "go";
}

function getEmployee($id) {
    $sql = "select e.id, e.firstName, e.lastName, e.title, e.city, e.officePhone, e.cellPhone, e.email, e.managerId, e.twitterId, e.tags, CONCAT(m.firstName, ' ', m.lastName) managerName, count(r.id) reportCount " .
            "from employee e " .
            "left join employee r on r.managerId = e.id " .
            "left join employee m on e.managerId = m.id " .
            "where e.id=:id";
    try {
        $db = getConnection();
        $stmt = $db->prepare($sql);
        $stmt->bindParam("id", $id);
        $stmt->execute();
        $employee = $stmt->fetchObject();
        $db = null;

        // Include support for JSONP requests
        if (!isset($_GET['callback'])) {
            echo json_encode($employee);
        } else {
            echo $_GET['callback'] . '(' . json_encode($employee) . ');';
        }

    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}

function getReports($id) {

    $sql = "select e.id, e.firstName, e.lastName, e.title, e.tags, count(r.id) reportCount " .
            "from employee e left join employee r on r.managerId = e.id " .
            "where e.managerId=:id " .
            "group by e.id order by e.lastName, e.firstName";

    try {
        $db = getConnection();
        $stmt = $db->prepare($sql);
        $stmt->bindParam("id", $id);
        $stmt->execute();
        $employees = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;

        // Include support for JSONP requests
        if (!isset($_GET['callback'])) {
            echo json_encode($employees);
        } else {
            echo $_GET['callback'] . '(' . json_encode($employees) . ');';
        }

    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}

function getEmployeesByName($name) {
    $sql = "select e.id, e.firstName, e.lastName, e.title, e.officePhone, e.cellPhone, e.email, e.tags, count(r.id) reportCount " .
            "from employee e left join employee r on r.managerId = e.id " .
            "WHERE UPPER(CONCAT(e.firstName, ' ', e.lastName)) LIKE :name " .
            "group by e.id order by e.lastName, e.firstName";
    try {
        $db = getConnection();
        $stmt = $db->prepare($sql);
        $name = "%".$name."%";
        $stmt->bindParam("name", $name);
        $stmt->execute();
        $employees = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;

        // Include support for JSONP requests
        if (!isset($_GET['callback'])) {
            echo json_encode($employees);
        } else {
            echo $_GET['callback'] . '(' . json_encode($employees) . ');';
        }

    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}'; 
    }
}

function getModifiedEmployees($modifiedSince) {
    if ($modifiedSince == 'null') {
        $modifiedSince = "1000-01-01";
    }
    $sql = "select * from employee WHERE lastModified > :modifiedSince";
    try {
        $db = getConnection();
        $stmt = $db->prepare($sql);
        $stmt->bindParam("modifiedSince", $modifiedSince);
        $stmt->execute();
        $employees = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;

        // Include support for JSONP requests
        if (!isset($_GET['callback'])) {
            echo json_encode($employees);
        } else {
            echo $_GET['callback'] . '(' . json_encode($employees) . ');';
        }

    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}

function updateEmployee($id) {
	$request = Slim::getInstance()->request();
	$body = $request->getBody();
	$wine = json_decode($body);
	$sql = "UPDATE employee SET firstName=:firstName, lastName=:lastName, title=:title, tags=:tags WHERE id=:id";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("firstName", $wine->firstName);
		$stmt->bindParam("lastName", $wine->lastName);
		$stmt->bindParam("title", $wine->title);
		$stmt->bindParam("tags", $wine->tags);
		$stmt->bindParam("id", $id);
		$stmt->execute();
		$db = null;
		//$app->response()->header('Content-Type', 'application/json');
        // Include support for JSONP requests
        if (!isset($_GET['callback'])) {
            echo json_encode($wine);
        } else {
            echo $_GET['callback'] . '(' . json_encode($wine) . ');';
        };
		//echo json_encode($wine); 
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function addEmployee() {
	//error_log('addContact\n', 3, '/var/tmp/php.log');
	$request = Slim::getInstance()->request();
	$wine = json_decode($request->getBody());
	$sql = "INSERT INTO employee (firstName, lastName, title, officePhone, cellPhone, email, tags) VALUES (:firstName, :lastName, :title, :officePhone, :cellPhone, :email, :tags)";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("firstName", $wine->firstName);
		$stmt->bindParam("lastName", $wine->lastName);
		$stmt->bindParam("title", $wine->title);
		$stmt->bindParam("officePhone", $wine->officePhone);
		$stmt->bindParam("cellPhone", $wine->cellPhone);
		$stmt->bindParam("email", $wine->email);
		$stmt->bindParam("tags", $wine->tags);
		$stmt->execute();
		$wine->id = $db->lastInsertId();
		$db = null;
		//$app->response()->header('Content-Type', 'application/json');
        if (!isset($_GET['callback'])) {
            echo json_encode($wine);
        } else {
            echo $_GET['callback'] . '(' . json_encode($wine) . ');';
        };
	} catch(PDOException $e) {
		//error_log($e->getMessage(), 3, '/var/tmp/php.log');
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function delEmployee($id) {
	$sql = "DELETE FROM employee WHERE id=:id";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("id", $id);
		$stmt->execute();
		$db = null;
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function getConnection() {
    $dbhost="127.0.0.1";
    $dbuser="root";
    $dbpass="pse=wti";
    $dbname="directory";
    $dbh = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);  
    $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    return $dbh;
}