<?php
if (!defined('ABSPATH')) {exit;}
if(!class_exists('SVB_Survey_Column_Model')) {
    class SVB_Survey_Column_Model
    {

        private $table_name = 'svb_columns';

        public function __construct()
        {
            global $wpdb;
            $this->table_name = $wpdb->prefix . $this->table_name;
        }

        public function addColumns($data)
        {
            global $wpdb;
            $data['created_at'] = wp_date("Y-m-d H:i:s", current_time("U"));

            // return $data;
            $find = $wpdb->get_row($wpdb->prepare("SELECT * FROM $this->table_name WHERE form_id=%s", $data['form_id']), 'ARRAY_A');

            $columns = json_decode($data['columns'], true);
            $exist_columns = json_decode($find['columns'], true) ?? [];

            if ($find) {
                $dataModel = new SVB_Survey_Data_Model();
                $submitted_data = $dataModel->getDataByFormId($data['form_id']);

                if (!$submitted_data) {
                    return $wpdb->update($this->table_name, $data, ['form_id' => $data['form_id']]);
                } else {
                    // && count($columns) >= count($exist_columns);
                    if (array_diff_assoc($columns, $exist_columns) || array_diff_assoc($exist_columns, $columns)) {
                        // $data['columns'] = wp_json_encode(wp_parse_args($columns, $exist_columns));
                        $updated = $wpdb->update($this->table_name, $data, ['form_id' => $data['form_id']]);
                        return $updated;
                    }
                }
            } else {
                $wpdb->insert($this->table_name, $data);
                return $wpdb->insert_id;
            }

            return true;

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

        public function getAll()
        {
            global $wpdb;
            $data = $wpdb->get_results("SELECT * FROM $this->table_name", 'ARRAY_A');
            foreach ($data as $index => $item) {
                $data[$index]['columns'] = json_decode(stripslashes($item['columns']), true);
            }
            return $data;
        }

        public function getDataByFormId()
        {

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
