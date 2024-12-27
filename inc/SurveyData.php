<?php
if (!defined('ABSPATH')) {exit;}
if(!class_exists('SVB_Survey_Data')) {
    class SVB_Survey_Data
    {
        protected $table;
        protected $version = 1.2;
        protected $name = 'svb_data';

        public function __construct(SVB_Table $table)
        {
            $this->table = $table;
        }

        public function getName()
        {
            return $this->name;
        }

        /**
         * Add videos table
         * This is used for global video analytics
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
                PRIMARY KEY (id)
                ", $this->version);
        }

        /**
         * Uninstall tables
         *
         * @return void
         */
        public function uninstall()
        {
            $this->table->drop($this->getName());
        }
    }
}

