<?php
require get_theme_file_path('/inc/search_route.php');
require get_theme_file_path('/inc/like_route.php');

function university_custom_rest()
{
  register_rest_field('post', 'authorName', array(
    'get_callback' => function () {
      return get_the_author();
    }
  ));
  register_rest_field('note', 'userNoteCount', array(
    'get_callback' => function () {
      return count_user_posts(get_current_user_id(), 'note');
    }
  ));
}

add_action('rest_api_init', 'university_custom_rest');

function page_panner($args = null)
{
  if (!isset($args['title'])) $args['title'] = get_the_title();
  if (!isset($args['subtitle'])) $args['subtitle'] = get_field('page_banner_subtitle');
  if (!isset($args['photo'])) {
    if (get_field('page_banner_background_image') and !is_archive() and !is_home()) $args['photo'] = get_field('page_banner_background_image')['sizes']['page_banner'];
    else $args['photo'] = get_theme_file_uri('/images/ocean.jpg');
  }
?>
  <div class="page-banner">
    <div class="page-banner__bg-image" style="background-image: url(<? echo $args['photo'] ?>)"></div>
    <div class="page-banner__conte nt container container--narrow">
      <h1 class="page-banner__title"><? echo $args['title'] ?></h1>
      <div class="page-banner__intro">
        <p><? echo $args['subtitle'] ?></p>
      </div>
    </div>
  </div>
<?php }

function university_files()
{
  wp_enqueue_script('main-university-js', get_theme_file_uri('/build/index.js'), array('jquery'), '1.0', true);
  wp_enqueue_style('custom-google-fonts', '//fonts.googleapis.com/css?family=Roboto+Condensed:300,300i,400,400i,700,700i|Roboto:100,300,400,400i,700,700i');
  wp_enqueue_style('font-awesome', '//maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css');
  wp_enqueue_style('university_main_styles', get_theme_file_uri('/build/style-index.css'));
  wp_enqueue_style('university_extra_styles', get_theme_file_uri('/build/index.css'));

  wp_localize_script('main-university-js', 'universityData', array(
    'rootUrl' => get_site_url(),
    'nonce' => wp_create_nonce('wp_rest')
  ));
}

add_action('wp_enqueue_scripts', 'university_files');

function university_features()
{
  // register_nav_menu('header_menu_location', 'Header Menu Location');
  // register_nav_menu('footer_location_one', 'Footer Location 1');
  // register_nav_menu('footer_location_two', 'Footer Location 2');
  add_theme_support('title-tag');
  add_theme_support('post-thumbnails');
  add_image_size('professor_landscape', 400, 260, true);
  add_image_size('professor_portrait', 480, 650, true);
  add_image_size('page_banner', 1500, 350, true);
}

add_action('after_setup_theme', 'university_features');

function university_adjust_queries($query)
{
  if (!is_admin() and is_post_type_archive('program') and is_main_query()) {
    $query->set('orderby', 'title');
    $query->set('order', 'ASC');
    $query->set('posts_per_page', -1);
  }

  if (!is_admin() and is_post_type_archive('event') and $query->is_main_query()) {
    $today = date('Ymd');

    $query->set('meta_key', 'event_date');
    $query->set('orderby', 'meta_value_num');
    $query->set('order', 'ASC');
    $query->set('meta_query', array(
      array(
        'key' => 'event_date',
        'compare' => '>=',
        'value' => $today,
        'type' => 'numeric'
      )
    ));
  }
}

add_action('pre_get_posts', 'university_adjust_queries');

function redirect_subs_to_frontend()
{
  $cur_user = wp_get_current_user();

  if (count($cur_user->roles) == 1 and $cur_user->roles[0] == 'subscriber') {
    wp_redirect(site_url('/'));
    exit;
  }
}

add_action('admin_init', 'redirect_subs_to_frontend');

function no_subs_admin_bar()
{
  $cur_user = wp_get_current_user();

  if (count($cur_user->roles) == 1 and $cur_user->roles[0] == 'subscriber') {
    show_admin_bar(false);
  }
}

add_action('wp_loaded', 'no_subs_admin_bar');

function custom_header_url()
{
  return esc_url(site_url('/'));
}

add_filter('login_headerurl', 'custom_header_url');

function login_CSS()
{
  wp_enqueue_style('custom-google-fonts', '//fonts.googleapis.com/css?family=Roboto+Condensed:300,300i,400,400i,700,700i|Roboto:100,300,400,400i,700,700i');
  wp_enqueue_style('font-awesome', '//maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css');
  wp_enqueue_style('university_main_styles', get_theme_file_uri('/build/style-index.css'));
  wp_enqueue_style('university_extra_styles', get_theme_file_uri('/build/index.css'));
}

add_action('login_enqueue_scripts', 'login_CSS');

function custom_login_title()
{
  return get_bloginfo('name');
}

add_filter('login_headertitle', 'custom_login_title');

function make_note_private($data, $post_arr)
{
  if ($data['post_type'] != 'note' or $data['post_status'] == 'trash') return $data;
  if (count_user_posts(get_current_user_id(), 'note') > 10 and !$post_arr['ID']) {
    die('You have reached your note limit!');
  }

  $data['post_title'] = sanitize_text_field($data['post_title']);
  $data['post_content'] = sanitize_textarea_field($data['post_content']);
  $data['post_status'] = 'private';
  return $data;
}

add_filter('wp_insert_post_data', 'make_note_private', 10, 2);

add_filter(
  'ai1wm_exclude_themes_from_export',
  function ($exclude_filters) {
    $exclude_filters[] = 'university-theme/node_modules';
    return $exclude_filters;
  }
);
