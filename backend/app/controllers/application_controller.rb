class ApplicationController < ActionController::API
  before_action :configure_permitted_parameters, if: :devise_controller?

  def require_admin!
    unless current_user&.admin?
      render json: { error: 'Unauthorized: Admin access required' }, status: :forbidden
    end
  end

  protected

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [:admin, :password_confirmation])
  end
end
