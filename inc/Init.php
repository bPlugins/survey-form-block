<?php
if (!defined('ABSPATH')) {exit;}
require_once __DIR__ . '/Table.php';
require_once __DIR__ . '/SurveyData.php';
require_once __DIR__ . '/SurveyColumns.php';
require_once __DIR__ . '/SurveyColumnModel.php';

if(!class_exists('BPSVB_Init')) {
    class BPSVB_Init
    {
        public function __construct()
        {
            foreach (self::get_tables() as $class) {
                if (class_exists($class)) {
                    $table = self::instantiate($class);
                    if (method_exists($table, 'install')) {
                        $table->install();
                    }
                }
            }
        }

        public static function get_tables()
        {
            return [
                BPSVB_Survey_Data::class,
                BPSVB_Survey_Columns::class,
            ];
        }

        public static function drop()
        {
            foreach (self::get_tables() as $class) {
                $table = self::instantiate($class);
                if (method_exists($table, 'uninstall')) {
                    $table->uninstall();
                }
            }
            return true;
        }

        private static function instantiate($class)
        {
            return new $class(new BPSVB_Table);
        }
    }
    new BPSVB_Init();
}

