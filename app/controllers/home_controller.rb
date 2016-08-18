class HomeController < ApplicationController
	def index
		output = $output

		# @message = "{\"payload\":[2,1,6,26,255,76,0,2,21,0,255,0,5,12],\"rssi\":-95,\"ble_channel\":39}"
		# @JSON_message = JSON.parse(@message)



		# Thread.new do
			# sleep(1)

			# MQTT::Client.connect('192.168.0.14',1883) do |c|
			#   # If you pass a block to the get method, then it will loop
			#   c.get('bledata') do |topic,message|
			# 		@parsedMessage ||= JSON.parse(message)
			# 		gon.watch.parsedMessage = @parsedMessage
			# 		# gon.JSON_message = @parsedMessage
			# 		# puts @parsedMessage['payload'][7]
			# 		break

			#   end
			# end
		# end

# #MOCK ONE
# 					@parsedMessage ||= JSON.parse(@message)
# 					gon.watch.parsedMessage = @parsedMessage
# 					gon.JSON_message = @parsedMessage
# #################








		



		w = params[:dimensions_width]
		h = params[:dimensions_height]
		# beacons = '[4 0 ; 0 0 ; 0 6; 4 6]'
		shapes = params[:shapes]
		beacons = params[:beacons]
		_A = params[:A]
		_H = params[:H]
		_Q = params[:Q]
		_R = params[:R]
		# payload = @parsedMessage['payload']
	

		payload = "{2,1,6,26,255,76,0,2,21,0,255,0,5,12}"

		puts "-----START-------------"
		puts $output
		puts "--------END----------"
		

		@runner = %x(./dist/tracker_exe.exe "#{w}" "#{h}" "#{shapes}" "#{beacons}" "#{_A}" "#{_H}" "#{_Q}" "#{_R}" "#{output[3]}" "#{output[2]}" "#{payload}" )


		if @runner != ""
			i = 0
			output_x = "["
			@runner.each_line do |line|
				# puts line
				if line.strip != ""
					if i < 3
						$output[i] = line.strip
						i = i + 1
					else
						output_x += line.strip + ";"
					end
				end
			end
			$output[3] = output_x + "]"
		end


		gon.watch.target = [$output[0].split(),$output[1].split()]



  	end

  	def modify
  		# $output = ['0','0','[0.5 0.5]','[300 400 500;10 10 10;300 400 500; 10 10 10]']
  		
  		width = params[:dimensions_width]
  		height = params[:dimensions_height]

  		if (!(width.blank?) && !(height.blank?))

	  		speed_min = 15 - 5
	  		speed_max = 15 + 5
	  		numParticles = 10


	  		$output = ['0','0'] # initialise output array; first two elem are neglible as they are never used as input

	  		output_weight = '['
	  		output_x = '['
	  		output_xdot = ';'
	   		output_y = ';'
	  		output_ydot = ';'

	  		for i in 1..numParticles
	  			output_weight += (1.0/numParticles).to_s + " " 
	  			output_x += rand(width.to_i).to_s + " "
	  			output_xdot += (rand(speed_max-speed_min)+speed_min).to_s + " " 
	  			output_y += rand(height.to_i).to_s + " "
	  			output_ydot += (rand(speed_max-speed_min)+speed_min).to_s + " " 
	  		end

	  		$output << (output_weight + "]")
	  		$output << (output_x + output_xdot + output_y + output_ydot + "]")

	  		puts $output
	  	end

  	end

  	def action_controller
  	end
end
