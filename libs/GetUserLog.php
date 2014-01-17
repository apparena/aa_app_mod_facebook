<?php
/**
 * getUserLog
 *
 * get user logs from database to evaluate participated users, selected friends and so on
 *
 * @category    logs
 * @package     facebook
 * @subpackage  logs
 *
 * @author      "Marcus Merchel" <kontakt@marcusmerchel.de>
 * @version     1.0.0 (12.11.13 - 12:00)
 */
namespace com\apparena\modules\facebook;

class getUserLog
{
    private $_db = null;
    private $_i_id = null;

    public function __construct(\com\apparena\utils\database\Database $db, $i_id)
    {
        $this->_db         = $db;
        $this->_i_id = $i_id;
    }

    public function getInvitedAmountByInst()
    {
        $result = $this->getDatabaseResultByCode('5001');

        $amount = array(
            'global' => 0
        );
        foreach ($result AS $log)
        {
            $data = json_decode($log->data);
            $amount['global'] += $data->amount;

            if (empty($data->door_id))
            {
                $data->door_id = 0;
            }

            if (empty($amount[$data->door_id]))
            {
                $amount[$data->door_id] = 0;
            }
            $amount[$data->door_id] += $data->amount;
        }

        return $amount;
    }

    public function getInvitedAmountByUser($uid)
    {
        $where  = "AND auth_uid = " . $this->_db->quote($uid);
        $result = $this->getDatabaseResultByCode('5001', $where);

        $amount = array(
            'global' => 0
        );
        foreach ($result AS $log)
        {
            $data = json_decode($log->data);
            $amount['global'] += $data->amount;

            if (empty($data->door_id))
            {
                $data->door_id = 0;
            }

            if (empty($amount[$data->door_id]))
            {
                $amount[$data->door_id] = 0;
            }
            $amount[$data->door_id] += $data->amount;
        }

        return $amount;
    }

    public function getUserParticipationsByInst()
    {
        $result = $this->getDatabaseResultByCode('5002');

        return count($result);
    }

    public function getUserParticipationsByUser($uid)
    {
        $like   = '%"invited_by":"' . $uid . '"%';
        $where  = "AND data LIKE " . $this->_db->quote($like);
        $result = $this->getDatabaseResultByCode('5002', $where);

        return count($result);
    }

    public function getParticipatedEmailsByInst()
    {
        $result = $this->getDatabaseResultByCode('5003');

        $emails = array();
        foreach ($result AS $log)
        {
            #pr('get userdate for id ' . $log->auth_uid);
            $sql      = "SELECT
                        email
                    FROM
                        mod_auth_user_data
                    WHERE
                        auth_uid = " . $this->_db->quote($log->auth_uid) . "
                    LIMIT 1
                    ";

            $user_result = $this->_db->query($sql);
            $emails[] = $user_result->fetchColumn(0);
        }

        return $emails;
    }

    public function getParticipatedEmailsByUser($uid)
    {
        $like   = '%"invited_by":"' . $uid . '"%';
        $where  = "AND data LIKE " . $this->_db->quote($like);
        $result = $this->getDatabaseResultByCode('5003', $where);

        $emails = array();
        foreach ($result AS $log)
        {
            #pr('get userdate for id ' . $log->auth_uid);
            $sql = "SELECT
                        email
                    FROM
                        mod_auth_user_data
                    WHERE
                        auth_uid = " . $this->_db->quote($log->auth_uid) . "
                    LIMIT 1
                    ";

            $user_result = $this->_db->query($sql);
            $emails[]    = $user_result->fetchColumn(0);
        }

        return $emails;
    }

    protected function getDatabaseResultByCode($code, $where = '')
    {
        $this->checkInstId()->checkConnection();
        $sql    = "SELECT
                    data,
                    auth_uid
                FROM
                    mod_log_user
                WHERE
                    i_id = " . $this->_db->quote($this->_i_id) . "
                    " . $where . "
                AND code = " . $this->_db->quote($code) . "
                ";
        $return = $this->_db->query($sql);
        $result = $return->fetchAll();

        return $result;
    }

    protected function checkInstId()
    {
        if (!is_numeric($this->_i_id) || $this->_i_id === null)
        {
            throw new \Exception('Instance ID is not numeric');
        }

        return $this;
    }

    protected function checkConnection()
    {
        if ($this->_db === null)
        {
            throw new \Exception('No database connection exist');
        }

        return $this;
    }
} 