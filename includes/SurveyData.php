<?php
/**
 * Submissions table definition.
 */

if (!defined('ABSPATH')) {exit;}

if(!class_exists('BPSVB_Survey_Data')) {
    class BPSVB_Survey_Data
    {
        /** @var BPSVB_Table */
        protected $table;

        /**
         * 1.3 adds an index on form_id. Every lookup filters by it, and without
         * the index each one was a full table scan.
         */
        protected $version = 1.3;

        protected $name = 'svb_data';

        public function __construct(BPSVB_Table $table)
        {
            $this->table = $table;
        }

        public function getName()
        {
            return $this->name;
        }

        /**
         * Creates or upgrades the submissions table.
         *
         * dbDelta only adds what is missing, so existing rows are untouched.
         *
         * @return void
         */
        public function install()
        {
            return $this->table->create($this->name, "
                id bigint(20) unsigned NOT NULL auto_increment,
                user_id bigint(20) unsigned NULL,
                form_creator_id int(20) unsigned NULL,
                form_id VARCHAR(50) NOT NULL,
                form_name VARCHAR(250) NOT NULL,
                data TEXT NOT NULL,
                created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
                PRIMARY KEY  (id),
                KEY form_id (form_id)
                ", $this->version);
        }

        /**
         * @return void
         */
        public function uninstall()
        {
            $this->table->drop($this->getName());
        }
    }
}
