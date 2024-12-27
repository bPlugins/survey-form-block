<?php
if (!defined('ABSPATH')) {exit;}
if(!class_exists('SVB_Survey_Data_Model')) {
    class SVB_Survey_Data_Model
    {
        private $table_name = 'svb_data';

        public function __construct()
        {
            global $wpdb;
            $this->table_name = $wpdb->prefix . $this->table_name;
        }

        public function addData($data)
        {
            global $wpdb;
            $data['created_at'] = wp_date("Y-m-d H:i:s", current_time("U"));
            $data['user_id'] = get_current_user_id();

            // $data['data'] = is_array($data['data']) ? wp_json_encode($data['data']) : $data['data'];
            // return $data;

            // return $data;

            $wpdb->insert($this->table_name, $data);
            return $wpdb->insert_id;

        }

        public function deleteData()
        {
            global $wpdb;
        }

        public function updateData($data, $where)
        {
            global $wpdb;
            return $wpdb->update($this->table_name, $data, $where);
        }

        public function getData($query)
        {
            return $query;
        }

        public function getAllData()
        {
            global $wpdb;

            $data = $wpdb->get_results("SELECT * FROM $this->table_name", 'ARRAY_A');

            foreach ($data as $index => $item) {
                $data[$index]['data'] = json_decode(stripslashes($item['data']), true);
            }

            return $data;
        }

        public function getDataByFormId($form_id)
        {
            global $wpdb;

            $data = $wpdb->get_row($wpdb->prepare("SELECT * FROM $this->table_name WHERE form_id=%s", $form_id), 'ARRAY_A');
            return $data;
        }

        public function getDataWithColumn($form_id)
        {
            global $wpdb;

            $data = $wpdb->get_row($wpdb->prepare("SELECT * FROM $this->table_name WHERE form_id=%s AND labels!=%s", $form_id, null), 'ARRAY_A');

            if ($data) {
                $data['labels'] = json_decode(stripslashes($data['labels']), true);
                $data['data'] = json_decode(stripslashes($data['data']), true);
                return $data;

            }
            return false;

        }
    }
}

