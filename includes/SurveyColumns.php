<?php
/**
 * Column-map table definition.
 */

if (!defined('ABSPATH')) {exit;}

if(!class_exists('BPSVB_Survey_Columns')) {
    class BPSVB_Survey_Columns
    {
        /** @var BPSVB_Table */
        protected $table;

        /**
         * 3 adds an index on form_id. Saving a post looks a form up by it, so
         * this ran as a full table scan on every save.
         *
         * 4 adds the survey's question schema and the post that owns it,
         * written by BPSVB_Schema_Index when a post is saved. Additive: dbDelta
         * adds the columns and leaves existing rows alone.
         */
        protected $version = 4;

        protected $name = 'svb_columns';

        public function __construct(BPSVB_Table $table)
        {
            $this->table = $table;
        }

        public function getName()
        {
            return $this->name;
        }

        /**
         * Creates or upgrades the column-map table.
         *
         * @return void
         */
        public function install()
        {
            return $this->table->create($this->name, "
                id bigint(20) unsigned NOT NULL auto_increment,
                form_id VARCHAR(50) NOT NULL,
                form_name VARCHAR(250) NOT NULL,
                columns TEXT NOT NULL,
                created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
                post_id bigint(20) unsigned NULL,
                field_schema LONGTEXT NULL,
                updated_at DATETIME NULL,
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
