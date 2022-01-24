window.repositoryObject = {"columns_custom_fields":[],"relations_custom_fields":[],"unique_keys_custom_fields":[],"triggers_custom_fields":[],"object_id":"t3762","name":"sprints","subtype":"TABLE","is_user_defined":false,"description":null,"summary":[{"field":"Documentation","value":{"_type":"link","name":"mydb@localhost","id":"d10"}},{"field":"Schema","value":""},{"field":"Name","value":"sprints"},{"field":"Type","value":"Table"}],"columns":[{"id":"column-34775","object_id":"column-34775","name":"idSprints","name_without_path":"idSprints","description":null,"is_pk":true,"is_identity":true,"data_type":"int","data_length":"10, 0","is_nullable":false,"computed_formula":"","default_value":null,"path":null,"level":1,"item_type":"COLUMN","is_user_defined":false,"custom_fields":{},"linked_terms":null,"references":[]},{"id":"column-34776","object_id":"column-34776","name":"nome","name_without_path":"nome","description":null,"is_pk":false,"is_identity":false,"data_type":"varchar","data_length":"45","is_nullable":false,"computed_formula":"","default_value":null,"path":null,"level":1,"item_type":"COLUMN","is_user_defined":false,"custom_fields":{},"linked_terms":null,"references":[]},{"id":"column-34773","object_id":"column-34773","name":"dataCriacao","name_without_path":"dataCriacao","description":null,"is_pk":false,"is_identity":false,"data_type":"datetime","data_length":null,"is_nullable":false,"computed_formula":"","default_value":null,"path":null,"level":1,"item_type":"COLUMN","is_user_defined":false,"custom_fields":{},"linked_terms":null,"references":[]},{"id":"column-34771","object_id":"column-34771","name":"cancelada","name_without_path":"cancelada","description":null,"is_pk":false,"is_identity":false,"data_type":"tinyint","data_length":"3, 0","is_nullable":true,"computed_formula":"","default_value":null,"path":null,"level":1,"item_type":"COLUMN","is_user_defined":false,"custom_fields":{},"linked_terms":null,"references":[]},{"id":"column-34772","object_id":"column-34772","name":"dataAlteracao","name_without_path":"dataAlteracao","description":null,"is_pk":false,"is_identity":false,"data_type":"datetime","data_length":null,"is_nullable":true,"computed_formula":"","default_value":null,"path":null,"level":1,"item_type":"COLUMN","is_user_defined":false,"custom_fields":{},"linked_terms":null,"references":[]},{"id":"column-34774","object_id":"column-34774","name":"idProjeto","name_without_path":"idProjeto","description":null,"is_pk":false,"is_identity":false,"data_type":"int","data_length":"10, 0","is_nullable":false,"computed_formula":"","default_value":null,"path":null,"level":1,"item_type":"COLUMN","is_user_defined":false,"custom_fields":{},"linked_terms":null,"references":[{"id":"t3760","name":"projetos","name_show_schema":"projetos"}]}],"relations":[{"name":"idProjeto_Sp","title":null,"description":null,"is_user_defined":false,"foreign_table":"sprints","foreign_table_show_schema":"sprints","foreign_table_verbose":"sprints","foreign_table_verbose_show_schema":"sprints","foreign_table_object_id":"t3762","primary_table":"projetos","primary_table_show_schema":"projetos","primary_table_verbose":"projetos","primary_table_verbose_show_schema":"projetos","primary_table_object_id":"t3760","pk_cardinality":"1x","fk_cardinality":"mx","constraints":[{"primary_column_path":null,"primary_column":"idProjetos","foreign_column_path":null,"foreign_column":"idProjeto"}],"custom_fields":{}},{"name":"idSprint","title":null,"description":null,"is_user_defined":false,"foreign_table":"tarefas","foreign_table_show_schema":"tarefas","foreign_table_verbose":"tarefas","foreign_table_verbose_show_schema":"tarefas","foreign_table_object_id":"t3765","primary_table":"sprints","primary_table_show_schema":"sprints","primary_table_verbose":"sprints","primary_table_verbose_show_schema":"sprints","primary_table_object_id":"t3762","pk_cardinality":"1x","fk_cardinality":"mx","constraints":[{"primary_column_path":null,"primary_column":"idSprints","foreign_column_path":null,"foreign_column":"idSprint"}],"custom_fields":{}}],"unique_keys":[{"name":"PRIMARY","description":null,"is_pk":true,"is_user_defined":false,"columns":[{"path":null,"name_without_path":"idSprints","name":"idSprints"}],"custom_fields":{}}],"triggers":[],"dependencies":{"uses":[{"object_name":"sprints","object_name_show_schema":"sprints","object_type":"TABLE","object_id":"t3762","type":"NORMAL","object_user_defined":false,"user_defined":false,"children":[{"object_name":"projetos","object_name_show_schema":"projetos","object_type":"TABLE","object_id":"t3760","type":"RELATION","pk_cardinality":"1x","fk_cardinality":"mx","object_user_defined":false,"user_defined":false,"children":[]}]}],"used_by":[{"object_name":"sprints","object_name_show_schema":"sprints","object_type":"TABLE","object_id":"t3762","type":"NORMAL","object_user_defined":false,"user_defined":false,"children":[{"object_name":"tarefas","object_name_show_schema":"tarefas","object_type":"TABLE","object_id":"t3765","type":"RELATION","pk_cardinality":"1x","fk_cardinality":"mx","object_user_defined":false,"user_defined":false,"children":[]}]}]},"imported_at":"2022-01-19 11:11"};