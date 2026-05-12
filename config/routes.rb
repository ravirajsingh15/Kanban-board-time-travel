Rails.application.routes.draw do

  constraints(host: "127.0.0.1") do
    get "(*path)",
      to: redirect { |params, req|
        "#{req.protocol}localhost:#{req.port}/#{params[:path]}"
      }
  end

  root "boards#index"

  get "boards/index"

  get 'inertia-example', to: 'inertia_example#index'

  get "up" => "rails/health#show", as: :rails_health_check

  resources :cards do
    collection do
      post :reorder
    end
  end

  resources :events, only: [:index]

  get "/timeline", to:  "timelines#index"

end