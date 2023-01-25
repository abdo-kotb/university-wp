<?php

function university_like_routes()
{
  register_rest_route('university/v1', 'manage-like', array(
    'methods' => 'POST',
    'callback' => 'create_like'
  ));
  register_rest_route('university/v1', 'manage-like', array(
    'methods' => 'DELETE',
    'callback' => 'delete_like'
  ));
};

function create_like($data)
{
  if (!is_user_logged_in())
    die('Only logged in users can like.');

  $professor = sanitize_text_field($data['professorId']);

  $exist_query = new WP_Query(array(
    'post_type' => 'like',
    'author' => get_current_user_id(),
    'meta_query' => array(
      array(
        'key' => 'liked_professor_id',
        'compare' => '=',
        'value' => $professor
      )
    )
  ));

  if ($exist_query->found_posts > 0 or get_post_type($professor) != 'professor')
    die('Invalid professor id');

  return wp_insert_post(array(
    'post_type' => 'like',
    'post_status' => 'publish',
    'meta_input' => array(
      'liked_professor_id' => $professor
    )
  ));
}

function delete_like($data)
{
  $likeId = sanitize_text_field($data['like']);
  if (get_current_user_id() == get_post_field('post_author', $likeId) and get_post_type($likeId) == 'like') {
    wp_delete_post($likeId, true);
    return 'Success';
  } else {
    die('You do not have permission to delete');
  }
}

add_action('rest_api_init', 'university_like_routes');
