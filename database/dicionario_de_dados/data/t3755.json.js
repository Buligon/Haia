window.repositoryObject = {"columns_custom_fields":[],"relations_custom_fields":[],"unique_keys_custom_fields":[],"triggers_custom_fields":[],"object_id":"t3755","name":"participantes","subtype":"TABLE","is_user_defined":false,"description":null,"summary":[{"field":"Documentation","value":{"_type":"link","name":"mydb@localhost","id":"d10"}},{"field":"Schema","value":""},{"field":"Name","value":"participantes"},{"field":"Type","value":"Table"}],"columns":[{"id":"column-34734","object_id":"column-34734","name":"idParticipantes","name_without_path":"idParticipantes","description":null,"is_pk":true,"is_identity":true,"data_type":"int","data_length":"10, 0","is_nullable":false,"computed_formula":"","default_value":null,"path":null,"level":1,"item_type":"COLUMN","is_user_defined":false,"custom_fields":{},"linked_terms":null,"references":[]},{"id":"column-34732","object_id":"column-34732","name":"idConversa","name_without_path":"idConversa","description":null,"is_pk":false,"is_identity":false,"data_type":"int","data_length":"10, 0","is_nullable":false,"computed_formula":"","default_value":null,"path":null,"level":1,"item_type":"COLUMN","is_user_defined":false,"custom_fields":{},"linked_terms":null,"references":[{"id":"t3751","name":"conversas","name_show_schema":"conversas"}]},{"id":"column-34733","object_id":"column-34733","name":"idParticipante","name_without_path":"idParticipante","description":null,"is_pk":false,"is_identity":false,"data_type":"int","data_length":"10, 0","is_nullable":false,"computed_formula":"","default_value":null,"path":null,"level":1,"item_type":"COLUMN","is_user_defined":false,"custom_fields":{},"linked_terms":null,"references":[{"id":"t3770","name":"usuarios","name_show_schema":"usuarios"}]},{"id":"column-34731","object_id":"column-34731","name":"cancelado","name_without_path":"cancelado","description":null,"is_pk":false,"is_identity":false,"data_type":"int","data_length":"10, 0","is_nullable":true,"computed_formula":"","default_value":null,"path":null,"level":1,"item_type":"COLUMN","is_user_defined":false,"custom_fields":{},"linked_terms":null,"references":[]}],"relations":[{"name":"idConversa_p","title":null,"description":null,"is_user_defined":false,"foreign_table":"participantes","foreign_table_show_schema":"participantes","foreign_table_verbose":"participantes","foreign_table_verbose_show_schema":"participantes","foreign_table_object_id":"t3755","primary_table":"conversas","primary_table_show_schema":"conversas","primary_table_verbose":"conversas","primary_table_verbose_show_schema":"conversas","primary_table_object_id":"t3751","pk_cardinality":"1x","fk_cardinality":"mx","constraints":[{"primary_column_path":null,"primary_column":"idConversa","foreign_column_path":null,"foreign_column":"idConversa"}],"custom_fields":{}},{"name":"idParticipante","title":null,"description":null,"is_user_defined":false,"foreign_table":"participantes","foreign_table_show_schema":"participantes","foreign_table_verbose":"participantes","foreign_table_verbose_show_schema":"participantes","foreign_table_object_id":"t3755","primary_table":"usuarios","primary_table_show_schema":"usuarios","primary_table_verbose":"usuarios","primary_table_verbose_show_schema":"usuarios","primary_table_object_id":"t3770","pk_cardinality":"1x","fk_cardinality":"mx","constraints":[{"primary_column_path":null,"primary_column":"idUsuarios","foreign_column_path":null,"foreign_column":"idParticipante"}],"custom_fields":{}}],"unique_keys":[{"name":"PRIMARY","description":null,"is_pk":true,"is_user_defined":false,"columns":[{"path":null,"name_without_path":"idParticipantes","name":"idParticipantes"}],"custom_fields":{}}],"triggers":[],"dependencies":{"uses":[{"object_name":"participantes","object_name_show_schema":"participantes","object_type":"TABLE","object_id":"t3755","type":"NORMAL","object_user_defined":false,"user_defined":false,"children":[{"object_name":"conversas","object_name_show_schema":"conversas","object_type":"TABLE","object_id":"t3751","type":"RELATION","pk_cardinality":"1x","fk_cardinality":"mx","object_user_defined":false,"user_defined":false,"children":[]},{"object_name":"usuarios","object_name_show_schema":"usuarios","object_type":"TABLE","object_id":"t3770","type":"RELATION","pk_cardinality":"1x","fk_cardinality":"mx","object_user_defined":false,"user_defined":false,"children":[]}]}],"used_by":[]},"imported_at":"2022-01-19 11:11"};