<?php
defined('_VALID_CALL') or die('Direct Access is not allowed.');

define('TBL_MAIN', 'mod_facebook_friends');

define('ROW_REQUEST_ID', 'request_id');
define('ROW_FB_UID', 'fb_uid');
define('ROW_AUTH_UID', 'auth_uid');
define('ROW_DOOR_ID', 'door_id');
define('ROW_i_id', 'i_id');
define('ROW_DATE_ADDED', 'date_added');

try
{
    if (empty($_POST['fbid']) || empty($_POST['request_id']))
    {
        throw new \Exception('Wrong request - needed params was not send by request in ' . __FILE__);
    }
    $fb_id    = (int)$_POST['fbid'];
    $auth_uid = (int)$_POST['auth_uid'];
    $door_id  = (int)$_POST['door_id'];
    $request_id = $_POST['request_id'];

    // prepare sql statement
    $sql = "INSERT INTO
                " . TBL_MAIN . "
            SET
                " . ROW_REQUEST_ID . " = :" . ROW_REQUEST_ID . ",
                " . ROW_FB_UID . " = :" . ROW_FB_UID . ",
                " . ROW_AUTH_UID . " = :" . ROW_AUTH_UID . ",
                " . ROW_DOOR_ID . " = :" . ROW_DOOR_ID . ",
                " . ROW_i_id . " = :" . ROW_i_id . ",
                " . ROW_DATE_ADDED . " = FROM_UNIXTIME(:" . ROW_DATE_ADDED . ")
            ";

    // prepare timestamp
    $current_day = new DateTime('now', new DateTimeZone($aa_default_timezone));
    $timestamp   = $current_day->getTimestamp();

    // prepare db statement and bind data
    $stmt = $db->prepare($sql);
    $stmt->bindParam(':' . ROW_REQUEST_ID, $request_id, PDO::PARAM_INT);
    $stmt->bindParam(':' . ROW_FB_UID, $fb_id, PDO::PARAM_INT);
    $stmt->bindParam(':' . ROW_AUTH_UID, $auth_uid, PDO::PARAM_INT);
    $stmt->bindParam(':' . ROW_i_id, $i_id, PDO::PARAM_INT);
    $stmt->bindParam(':' . ROW_DOOR_ID, $door_id, PDO::PARAM_INT);
    $stmt->bindParam(':' . ROW_DATE_ADDED, $timestamp, PDO::PARAM_STR);

    if ($stmt->execute())
    {
        $return['code']    = 200;
        $return['status']  = 'success';
        $return['message'] = 'data successfully stored';
    }
}
catch (Exception $e)
{
    // prepare return data
    $return['code']    = $e->getCode();
    $return['status']  = 'error';
    $return['message'] = $e->getMessage();
    $return['trace']   = $e->getTrace();
}
catch (PDOException $e)
{
    // prepare return data for database errors
    $return['code']    = $e->getCode();
    $return['status']  = 'error';
    $return['message'] = $e->getMessage();
    $return['trace']   = $e->getTrace();
}

