<?php
if (!defined('ABSPATH')) {exit;}
require_once __DIR__ . '/SurveyDataModel.php';
if(!class_exists('BPSVB_Ajax')) {
    class BPSVB_Ajax
    {
        private $model = null;
        public function __construct()
        {
            $this->model = new BPSVB_Survey_Data_Model();
            add_action('wp_ajax_svb_data_add', [$this, 'svb_data_add']);
            add_action('wp_ajax_nopriv_svb_data_add', [$this, 'svb_data_add']);

            add_action('wp_ajax_svb_get_all_data', [$this, 'get_all_data']);

            add_action('wp_ajax_svb_add_update_columns', [$this, 'svb_add_update_columns']);
            // add_action('wp_ajax_nopriv_svb_add_update_columns', [$this, 'svb_add_update_columns']);
        }

        public function svb_data_add()
        {
            $nonce = isset($_POST['nonce']) ? sanitize_text_field(wp_unslash($_POST['nonce'])) : '';

            if (!wp_verify_nonce($nonce, 'wp_ajax')) {
                wp_send_json_error('invalid data');
            }

            $model = new BPSVB_Survey_Data_Model();

            if (!isset($_POST['form_id']) && $_POST['form_id'] == '') {
                wp_send_json_error('form_id not found');
            }

            // $form_id = sanitize_text_field($_POST['form_id']);

            $data = [
                'data' => isset( $_POST['data'] ) ? stripslashes(sanitize_text_field(wp_unslash($_POST['data']))): '',
                'form_id' => isset($_POST['form_id']) ? sanitize_text_field(wp_unslash($_POST['form_id'])): '',
                'form_creator_id' => isset($_POST['form_creator_id']) ? sanitize_text_field(wp_unslash($_POST['form_creator_id'])): '',
                'form_name' => isset( $_POST['form_name'] ) ? stripslashes(sanitize_text_field(wp_unslash($_POST['form_name']))): '',
            ];

            $insert_id = $model->addData($data);
            if (!$insert_id) {
                wp_send_json_error('something went wrong!');
            }

            wp_send_json_success($insert_id);

        }

        public function get_all_data()
        {
            $nonce = isset($_GET['nonce']) ? sanitize_text_field(wp_unslash($_GET['nonce'])) : '';

            if (!wp_verify_nonce($nonce, 'wp_ajax')) {
                wp_send_json_error('validation failed');
            }

            $model = new BPSVB_Survey_Data_Model();
            $columnsModel = new BPSVB_Survey_Column_Model();

            wp_send_json_success(['data' => $model->getAllData(), 'columns' => $columnsModel->getAll()]);
            wp_die();
        }

        public function svb_get_columns_value()
        {
            $nonce = isset($_GET['nonce']) ? sanitize_text_field(wp_unslash($_GET['nonce'])) : '';

            if (!wp_verify_nonce($nonce, 'wp_ajax')) {
                wp_send_json_error('validation failed');
            }

            $query = isset($_GET['query']) ? sanitize_text_field(wp_unslash($_GET['query'])): '';
            $model = new BPSVB_Survey_Data_Model();

            $query = is_array($query) ? $query : json_decode(stripslashes($query), true);

            wp_send_json_success($model->getData($query));
        }

        public function svb_add_update_columns()
        {

            $nonce = isset($_POST['nonce']) ? sanitize_text_field(wp_unslash($_POST['nonce'])): '';

            if (!wp_verify_nonce($nonce, 'wp_ajax')) {
                wp_send_json_error('validation failed');
            }

            $form_id = isset($_POST['form_id']) ? sanitize_text_field(wp_unslash($_POST['form_id'])): '';
            $form_name = isset($_POST['form_name']) ? sanitize_text_field(wp_unslash($_POST['form_name'])): '';
            $columns = isset($_POST['columns']) ? stripslashes(sanitize_text_field(wp_unslash($_POST['columns']))): '';

            $model = new BPSVB_Survey_Column_Model();

            $insert_id = $model->addColumns(['columns' => $columns, 'form_id' => $form_id, 'form_name' => $form_name]);
            wp_send_json_success($insert_id);

        }
    }
    new BPSVB_Ajax();
}