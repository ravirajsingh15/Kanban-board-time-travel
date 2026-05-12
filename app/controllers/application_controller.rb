class ApplicationController < ActionController::Base
  allow_browser versions: :modern
  include InertiaRails::Controller
end
